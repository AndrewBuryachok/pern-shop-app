import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags(':project/residents')
@Controller(':project/residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('my')
  getMyResidents(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.residentsService.getMyResidents(project, myId, req);
  }

  @Delete(':userId')
  deleteResident(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.deleteResident(project, { userId, myId });
  }
}
