import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WaresService } from './wares.service';
import { Ware } from './ware.entity';
import { CreateWareDto } from './ware.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('wares')
export class WaresController {
  constructor(private waresService: WaresService) {}

  @Get()
  getMainWares(@Query() req: Request): Promise<Response<Ware>> {
    return this.waresService.getMainWares(req);
  }

  @Get('my')
  getMyWares(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Ware>> {
    return this.waresService.getMyWares(myId, req);
  }

  @Get('placed')
  getPlacedWares(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Ware>> {
    return this.waresService.getPlacedWares(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllWares(@Query() req: Request): Promise<Response<Ware>> {
    return this.waresService.getAllWares(req);
  }

  @Post()
  createWare(@MyId() myId: number, @Body() dto: CreateWareDto): Promise<void> {
    return this.waresService.createWare({ ...dto, myId });
  }
}
