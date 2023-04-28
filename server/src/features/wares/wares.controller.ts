import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WaresService } from './wares.service';
import { Ware } from './ware.entity';
import { CreateWareDto, EditWareDto, WareIdDto } from './ware.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('wares')
@Controller('wares')
export class WaresController {
  constructor(private waresService: WaresService) {}

  @Public()
  @Get('stats')
  getWaresStats(): Promise<Stats> {
    return this.waresService.getWaresStats();
  }

  @Public()
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

  @Patch(':wareId')
  editWare(
    @MyId() myId: number,
    @Param() { wareId }: WareIdDto,
    @Body() dto: EditWareDto,
  ): Promise<void> {
    return this.waresService.editWare({ ...dto, wareId, myId });
  }
}
