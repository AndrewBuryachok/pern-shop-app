import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HaulagesService } from './haulages.service';
import { Haulage } from './haulage.entity';
import {
  CompleteHaulageDto,
  CreateHaulageDto,
  EditHaulageDto,
  HaulageIdDto,
  TakeHaulageDto,
} from './haulage.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('haulages')
@Controller('haulages')
export class HaulagesController {
  constructor(private haulagesService: HaulagesService) {}

  @Public()
  @Get()
  getMainHaulages(@Query() req: Request): Promise<Response<Haulage>> {
    return this.haulagesService.getMainHaulages(req);
  }

  @Get('my')
  getMyHaulages(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Haulage>> {
    return this.haulagesService.getMyHaulages(myId, req);
  }

  @Get('taken')
  getTakenHaulages(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Haulage>> {
    return this.haulagesService.getTakenHaulages(myId, req);
  }

  @Get('placed')
  getPlacedHaulages(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Haulage>> {
    return this.haulagesService.getPlacedHaulages(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllHaulages(@Query() req: Request): Promise<Response<Haulage>> {
    return this.haulagesService.getAllHaulages(req);
  }

  @Post()
  createHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateHaulageDto,
  ): Promise<void> {
    return this.haulagesService.createHaulage({ ...dto, myId, hasRole });
  }

  @Patch(':haulageId')
  editHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { haulageId }: HaulageIdDto,
    @Body() dto: EditHaulageDto,
  ): Promise<void> {
    return this.haulagesService.editHaulage({
      ...dto,
      haulageId,
      myId,
      hasRole,
    });
  }

  @Post(':haulageId/take')
  takeHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { haulageId }: HaulageIdDto,
    @Body() dto: TakeHaulageDto,
  ): Promise<void> {
    return this.haulagesService.takeHaulage({
      ...dto,
      haulageId,
      myId,
      hasRole,
    });
  }

  @Delete(':haulageId/take')
  untakeHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { haulageId }: HaulageIdDto,
  ): Promise<void> {
    return this.haulagesService.untakeHaulage({ haulageId, myId, hasRole });
  }

  @Post(':haulageId/execute')
  executeHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { haulageId }: HaulageIdDto,
  ): Promise<void> {
    return this.haulagesService.executeHaulage({ haulageId, myId, hasRole });
  }

  @Post(':haulageId')
  completeHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { haulageId }: HaulageIdDto,
    @Body() dto: CompleteHaulageDto,
  ): Promise<void> {
    return this.haulagesService.completeHaulage({
      ...dto,
      haulageId,
      myId,
      hasRole,
    });
  }

  @Delete(':haulageId')
  deleteHaulage(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { haulageId }: HaulageIdDto,
  ): Promise<void> {
    return this.haulagesService.deleteHaulage({ haulageId, myId, hasRole });
  }
}
