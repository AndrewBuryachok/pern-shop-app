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
import { AdvertsService } from './adverts.service';
import { Advert } from './advert.entity';
import {
  CreateAdvertDto,
  EditAdvertDto,
  AdvertIdDto,
  RespondAdvertDto,
} from './advert.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('adverts')
@Controller('adverts')
export class AdvertsController {
  constructor(private advertsService: AdvertsService) {}

  @Public()
  @Get()
  getMainAdverts(@Query() req: Request): Promise<Response<Advert>> {
    return this.advertsService.getMainAdverts(req);
  }

  @Get('my')
  getMyAdverts(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Advert>> {
    return this.advertsService.getMyAdverts(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllAdverts(@Query() req: Request): Promise<Response<Advert>> {
    return this.advertsService.getAllAdverts(req);
  }

  @Post()
  createAdvert(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateAdvertDto,
  ): Promise<void> {
    return this.advertsService.createAdvert({ ...dto, myId, hasRole });
  }

  @Patch(':advertId')
  editAdvert(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { advertId }: AdvertIdDto,
    @Body() dto: EditAdvertDto,
  ): Promise<void> {
    return this.advertsService.editAdvert({ ...dto, advertId, myId, hasRole });
  }

  @Delete(':advertId')
  deleteAdvert(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { advertId }: AdvertIdDto,
  ): Promise<void> {
    return this.advertsService.deleteAdvert({ advertId, myId, hasRole });
  }

  @Post(':advertId')
  respondAdvert(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { advertId }: AdvertIdDto,
    @Body() dto: RespondAdvertDto,
  ): Promise<void> {
    return this.advertsService.respondAdvert({
      ...dto,
      advertId,
      myId,
      hasRole,
    });
  }
}
