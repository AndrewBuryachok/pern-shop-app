import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  constructor(
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private usersService: UsersService,
    private townsService: TownsService,
    private mqttService: MqttService,
  ) {}

  async getMyResidents(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getResidentsQueryBuilder(req)
      .leftJoin('town.users', 'townUsers')
      .andWhere('townUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSentInvitations(
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getResidentsQueryBuilder(req)
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
    myId: number,
    req: Request,
  ): Promise<Response<Town>> {
    const [result, count] = await this.townsService
      .getResidentsQueryBuilder(req)
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
    myId: number,
    req: Request,
  ): Promise<Response<Town>> {
    const [result, count] = await this.townsService
      .getResidentsQueryBuilder(req)
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
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getResidentsQueryBuilder(req)
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
    dto: UpdateResidentByUserDto & { nick: string },
  ): Promise<void> {
    const town =
      dto.userId === dto.myId
        ? await this.townsService.checkInTown(dto.userId)
        : await this.townsService.checkHaveTown(dto.myId);
    if (town.userId === dto.userId) {
      throw new AppException(ResidentError.OWNER);
    }
    await this.usersService.removeUserTown({
      userId: dto.userId,
      townId: town.id,
    });
    if (dto.userId === dto.myId) {
      this.mqttService.publishNotificationMessage(
        dto.userId,
        town.userId,
        dto.nick,
        Notification.LEFT_RESIDENT,
      );
    } else {
      this.mqttService.publishNotificationMessage(
        dto.userId,
        dto.userId,
        dto.nick,
        Notification.DELETED_RESIDENT,
      );
    }
  }

  async createResidentInvitation(
    dto: UpdateResidentByUserDto & { nick: string },
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(dto.myId);
    await this.townsService.checkNotInTown(dto.userId);
    await this.checkInvitationNotExist(town.id, dto.userId);
    await this.createInvitation(dto, town.id);
    this.mqttService.publishNotificationMessage(
      town.id,
      dto.userId,
      dto.nick,
      Notification.CREATED_INVITATION,
    );
  }

  async cancelResidentInvitation(
    dto: UpdateResidentByUserDto & { nick: string },
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(dto.myId);
    const invitation = await this.checkInvitationExist(town.id, dto.userId);
    await this.deleteInvitation(invitation);
    this.mqttService.publishNotificationMessage(
      town.id,
      dto.userId,
      dto.nick,
      Notification.CANCELED_INVITATION,
    );
  }

  async acceptResidentInvitation(
    dto: UpdateResidentByTownDto & { nick: string },
  ): Promise<void> {
    const invitation = await this.checkInvitationExist(dto.townId, dto.myId);
    await this.usersService.addUserTown({
      userId: dto.myId,
      townId: dto.townId,
    });
    const userId = await this.townsService.findTownUserIdById(dto.townId);
    this.mqttService.publishNotificationMessage(
      dto.myId,
      userId,
      dto.nick,
      Notification.ACCEPTED_INVITATION,
    );
    await this.deleteInvitation(invitation);
  }

  async rejectResidentInvitation(
    dto: UpdateResidentByTownDto & { nick: string },
  ): Promise<void> {
    const invitation = await this.checkInvitationExist(dto.townId, dto.myId);
    await this.deleteInvitation(invitation);
    const userId = await this.townsService.findTownUserIdById(dto.townId);
    this.mqttService.publishNotificationMessage(
      dto.myId,
      userId,
      dto.nick,
      Notification.REJECTED_INVITATION,
    );
  }

  async createResidentApplication(
    dto: UpdateResidentByTownDto & { nick: string },
  ): Promise<void> {
    await this.townsService.checkNotInTown(dto.myId);
    await this.checkApplicationNotExist(dto.townId, dto.myId);
    await this.createApplication(dto);
    const userId = await this.townsService.findTownUserIdById(dto.townId);
    this.mqttService.publishNotificationMessage(
      dto.myId,
      userId,
      dto.nick,
      Notification.CREATED_INVITATION,
    );
  }

  async cancelResidentApplication(
    dto: UpdateResidentByTownDto & { nick: string },
  ): Promise<void> {
    const application = await this.checkApplicationExist(dto.townId, dto.myId);
    await this.deleteApplication(application);
    const userId = await this.townsService.findTownUserIdById(dto.townId);
    this.mqttService.publishNotificationMessage(
      dto.myId,
      userId,
      dto.nick,
      Notification.CREATED_INVITATION,
    );
  }

  async acceptResidentApplication(
    dto: UpdateResidentByUserDto & { nick: string },
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(dto.myId);
    const application = await this.checkApplicationExist(town.id, dto.userId);
    await this.usersService.addUserTown({
      userId: dto.userId,
      townId: town.id,
    });
    this.mqttService.publishNotificationMessage(
      town.id,
      dto.userId,
      dto.nick,
      Notification.ACCEPTED_APPLICATION,
    );
    await this.deleteApplication(application);
  }

  async rejectResidentApplication(
    dto: UpdateResidentByUserDto & { nick: string },
  ): Promise<void> {
    const town = await this.townsService.checkHaveTown(dto.myId);
    const application = await this.checkApplicationExist(town.id, dto.userId);
    await this.deleteApplication(application);
    this.mqttService.publishNotificationMessage(
      town.id,
      dto.userId,
      dto.nick,
      Notification.REJECTED_APPLICATION,
    );
  }

  private async checkInvitationExist(
    townId: number,
    userId: number,
  ): Promise<Invitation> {
    const invitation = await this.invitationsRepository.findOneBy({
      townId,
      userId,
    });
    if (!invitation) {
      throw new AppException(InvitationError.NOT_EXIST);
    }
    return invitation;
  }

  private async checkInvitationNotExist(
    townId: number,
    userId: number,
  ): Promise<void> {
    const invitation = await this.invitationsRepository.findOneBy({
      townId,
      userId,
    });
    if (invitation) {
      throw new AppException(InvitationError.ALREADY_EXIST);
    }
  }

  private async checkApplicationExist(
    townId: number,
    userId: number,
  ): Promise<Application> {
    const application = await this.applicationsRepository.findOneBy({
      townId: townId,
      userId: userId,
    });
    if (!application) {
      throw new AppException(ApplicationError.NOT_EXIST);
    }
    return application;
  }

  private async checkApplicationNotExist(
    townId: number,
    userId: number,
  ): Promise<void> {
    const application = await this.applicationsRepository.findOneBy({
      townId: townId,
      userId: userId,
    });
    if (application) {
      throw new AppException(ApplicationError.ALREADY_EXIST);
    }
  }

  private async createInvitation(
    dto: UpdateResidentByUserDto,
    townId: number,
  ): Promise<Invitation> {
    try {
      const invitation = this.invitationsRepository.create({
        townId,
        userId: dto.userId,
      });
      await this.invitationsRepository.save(invitation);
      return invitation;
    } catch (error) {
      throw new AppException(InvitationError.CREATE_FAILED);
    }
  }

  private async deleteInvitation(invitation: Invitation): Promise<void> {
    try {
      await this.invitationsRepository.remove(invitation);
    } catch (error) {
      throw new AppException(InvitationError.DELETE_FAILED);
    }
  }

  private async createApplication(
    dto: UpdateResidentByTownDto,
  ): Promise<Application> {
    try {
      const application = this.applicationsRepository.create({
        townId: dto.townId,
        userId: dto.myId,
      });
      await this.applicationsRepository.save(application);
      return application;
    } catch (error) {
      throw new AppException(ApplicationError.CREATE_FAILED);
    }
  }

  private async deleteApplication(application: Application): Promise<void> {
    try {
      await this.applicationsRepository.remove(application);
    } catch (error) {
      throw new AppException(ApplicationError.DELETE_FAILED);
    }
  }
}
