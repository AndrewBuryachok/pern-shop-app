import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags('residents')
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('my')
  getMyResidents(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.residentsService.getMyResidents(myId, req);
  }

  @Delete(':userId')
  deleteResident(
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.deleteResident({ userId, myId });
  }
}
