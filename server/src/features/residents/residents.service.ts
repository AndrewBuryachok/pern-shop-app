import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '../../database.enum';
import { Invitation } from './invitation.entity';
import { Application } from './application.entity';
import { User } from '../users/user.entity';
import { Town } from '../towns/town.entity';
import { UsersService } from '../users/users.service';
import { TownsService } from '../towns/towns.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  UpdateResidentByTownDto,
  UpdateResidentByUserDto,
} from './resident.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ResidentError } from './resident-error.enum';
import { InvitationError } from './invitation-error.enum';
import { ApplicationError } from './application-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class ResidentsService {
  private invitationsRepositoryMap: Map<string, Repository<Invitation>>;
  private applicationsRepositoryMap: Map<string, Repository<Application>>;

  constructor(
    @InjectRepository(Invitation, Database.DB1)
    private invitations1Repository: Repository<Invitation>,
    @InjectRepository(Invitation, Database.DB2)
    private invitations2Repository: Repository<Invitation>,
    @InjectRepository(Application, Database.DB1)
    private applications1Repository: Repository<Application>,
    @InjectRepository(Application, Database.DB2)
    private applications2Repository: Repository<Application>,
    private usersService: UsersService,
    private townsService: TownsService,
    private mqttService: MqttService,
  ) {
    this.invitationsRepositoryMap = new Map(
      [this.invitations1Repository, this.invitations2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
    this.applicationsRepositoryMap = new Map(
      [this.applications1Repository, this.applications2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMyResidents(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getResidentsQueryBuilder(project, req)
      .leftJoin('town.users', 'townUsers')
      .andWhere('townUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSentInvitations(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getResidentsQueryBuilder(project, req)
      .leftJoinAndMapMany(
        'user.invitations',
        'invitations',
        'invitation',
        'invitation.userId = user.id',
      )
      .leftJoin('invitation.town', 'subTown')
      .andWhere('subTown.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedInvitations(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Town>> {
    const [result, count] = await this.townsService
      .getResidentsQueryBuilder(project, req)
      .leftJoinAndMapMany(
        'town.invitations',
        'invitations',
        'invitation',
        'invitation.townId = town.id',
      )
      .andWhere('invitation.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSentApplications(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Town>> {
    const [result, count] = await this.townsService
      .getResidentsQueryBuilder(project, req)
      .leftJoinAndMapMany(
        'town.applications',
        'applications',
        'application',
        'application.townId = town.id',
      )
      .andWhere('application.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedApplications(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getResidentsQueryBuilder(project, req)
      .leftJoinAndMapMany(
        'user.applications',
        'applications',
        'application',
        'application.userId = user.id',
      )
      .leftJoin('application.town', 'subTown')
      .andWhere('subTown.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async deleteResident(
    project: string,
    dto: UpdateResidentByUserDto,
  ): Promise<void> {
    const town =
      dto.userId === dto.myId
        ? await this.townsService.checkInTown(project, dto.userId)
        : await this.townsService.checkHaveTown(project, dto.myId);
    if (town.userId === dto.userId) {
      throw new AppException(ResidentError.OWNER);
    }
    await this.usersService.removeUserTown(project, {
      userId: dto.userId,
      townId: town.id,
    });
    if (dto.userId === dto.myId) {
      this.mqttService.publishNotification(
        project,
        dto.userId,
        town.userId,
        dto.myId,
        Notification.LEFT_RESIDENT,
      );
    } else {
      this.mqttService.publishNotification(
        project,
        dto.userId,
        dto.userId,
        dto.myId,
        Notification.DELETED_RESIDENT,
      );
    }
  }

  async createResidentInvitation(
    project: string,
    dto: UpdateResidentByUserDto,
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(project, dto.myId);
    await this.townsService.checkNotInTown(project, dto.userId);
    await this.checkInvitationNotExist(project, town.id, dto.userId);
    await this.createInvitation(project, dto, town.id);
    this.mqttService.publishNotification(
      project,
      town.id,
      dto.userId,
      dto.myId,
      Notification.CREATED_INVITATION,
    );
  }

  async cancelResidentInvitation(
    project: string,
    dto: UpdateResidentByUserDto,
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(project, dto.myId);
    const invitation = await this.checkInvitationExist(
      project,
      town.id,
      dto.userId,
    );
    await this.deleteInvitation(project, invitation);
    this.mqttService.publishNotification(
      project,
      town.id,
      dto.userId,
      dto.myId,
      Notification.CANCELED_INVITATION,
    );
  }

  async acceptResidentInvitation(
    project: string,
    dto: UpdateResidentByTownDto,
  ): Promise<void> {
    const invitation = await this.checkInvitationExist(
      project,
      dto.townId,
      dto.myId,
    );
    await this.usersService.addUserTown(project, {
      userId: dto.myId,
      townId: dto.townId,
    });
    const userId = await this.townsService.findTownUserIdById(
      project,
      dto.townId,
    );
    this.mqttService.publishNotification(
      project,
      dto.myId,
      userId,
      dto.myId,
      Notification.ACCEPTED_INVITATION,
    );
    await this.deleteInvitation(project, invitation);
  }

  async rejectResidentInvitation(
    project: string,
    dto: UpdateResidentByTownDto,
  ): Promise<void> {
    const invitation = await this.checkInvitationExist(
      project,
      dto.townId,
      dto.myId,
    );
    await this.deleteInvitation(project, invitation);
    const userId = await this.townsService.findTownUserIdById(
      project,
      dto.townId,
    );
    this.mqttService.publishNotification(
      project,
      dto.myId,
      userId,
      dto.myId,
      Notification.REJECTED_INVITATION,
    );
  }

  async createResidentApplication(
    project: string,
    dto: UpdateResidentByTownDto,
  ): Promise<void> {
    await this.townsService.checkNotInTown(project, dto.myId);
    await this.checkApplicationNotExist(project, dto.townId, dto.myId);
    await this.createApplication(project, dto);
    const userId = await this.townsService.findTownUserIdById(
      project,
      dto.townId,
    );
    this.mqttService.publishNotification(
      project,
      dto.myId,
      userId,
      dto.myId,
      Notification.CREATED_APPLICATION,
    );
  }

  async cancelResidentApplication(
    project: string,
    dto: UpdateResidentByTownDto,
  ): Promise<void> {
    const application = await this.checkApplicationExist(
      project,
      dto.townId,
      dto.myId,
    );
    await this.deleteApplication(project, application);
    const userId = await this.townsService.findTownUserIdById(
      project,
      dto.townId,
    );
    this.mqttService.publishNotification(
      project,
      dto.myId,
      userId,
      dto.myId,
      Notification.CREATED_APPLICATION,
    );
  }

  async acceptResidentApplication(
    project: string,
    dto: UpdateResidentByUserDto,
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(project, dto.myId);
    const application = await this.checkApplicationExist(
      project,
      town.id,
      dto.userId,
    );
    await this.usersService.addUserTown(project, {
      userId: dto.userId,
      townId: town.id,
    });
    this.mqttService.publishNotification(
      project,
      town.id,
      dto.userId,
      dto.myId,
      Notification.ACCEPTED_APPLICATION,
    );
    await this.deleteApplication(project, application);
  }

  async rejectResidentApplication(
    project: string,
    dto: UpdateResidentByUserDto,
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(project, dto.myId);
    const application = await this.checkApplicationExist(
      project,
      town.id,
      dto.userId,
    );
    await this.deleteApplication(project, application);
    this.mqttService.publishNotification(
      project,
      town.id,
      dto.userId,
      dto.myId,
      Notification.REJECTED_APPLICATION,
    );
  }

  private async checkInvitationExist(
    project: string,
    townId: number,
    userId: number,
  ): Promise<Invitation> {
    const invitation = await this.invitationsRepositoryMap
      .get(project)
      .findOneBy({
        townId,
        userId,
      });
    if (!invitation) {
      throw new AppException(InvitationError.NOT_EXIST);
    }
    return invitation;
  }

  private async checkInvitationNotExist(
    project: string,
    townId: number,
    userId: number,
  ): Promise<void> {
    const invitation = await this.invitationsRepositoryMap
      .get(project)
      .findOneBy({
        townId,
        userId,
      });
    if (invitation) {
      throw new AppException(InvitationError.ALREADY_EXIST);
    }
  }

  private async checkApplicationExist(
    project: string,
    townId: number,
    userId: number,
  ): Promise<Application> {
    const application = await this.applicationsRepositoryMap
      .get(project)
      .findOneBy({
        townId: townId,
        userId: userId,
      });
    if (!application) {
      throw new AppException(ApplicationError.NOT_EXIST);
    }
    return application;
  }

  private async checkApplicationNotExist(
    project: string,
    townId: number,
    userId: number,
  ): Promise<void> {
    const application = await this.applicationsRepositoryMap
      .get(project)
      .findOneBy({
        townId: townId,
        userId: userId,
      });
    if (application) {
      throw new AppException(ApplicationError.ALREADY_EXIST);
    }
  }

  private async createInvitation(
    project: string,
    dto: UpdateResidentByUserDto,
    townId: number,
  ): Promise<Invitation> {
    try {
      const invitation = this.invitationsRepositoryMap.get(project).create({
        townId,
        userId: dto.userId,
      });
      await this.invitationsRepositoryMap.get(project).save(invitation);
      return invitation;
    } catch (error) {
      throw new AppException(InvitationError.CREATE_FAILED);
    }
  }

  private async deleteInvitation(
    project: string,
    invitation: Invitation,
  ): Promise<void> {
    try {
      await this.invitationsRepositoryMap.get(project).remove(invitation);
    } catch (error) {
      throw new AppException(InvitationError.DELETE_FAILED);
    }
  }

  private async createApplication(
    project: string,
    dto: UpdateResidentByTownDto,
  ): Promise<Application> {
    try {
      const application = this.applicationsRepositoryMap.get(project).create({
        townId: dto.townId,
        userId: dto.myId,
      });
      await this.applicationsRepositoryMap.get(project).save(application);
      return application;
    } catch (error) {
      throw new AppException(ApplicationError.CREATE_FAILED);
    }
  }

  private async deleteApplication(
    project: string,
    application: Application,
  ): Promise<void> {
    try {
      await this.applicationsRepositoryMap.get(project).remove(application);
    } catch (error) {
      throw new AppException(ApplicationError.DELETE_FAILED);
    }
  }
}
