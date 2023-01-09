import { Body, Controller, Get, Post } from '@nestjs/common';
import { WaresService } from './wares.service';
import { Ware } from './ware.entity';
import { CreateWareDto } from './ware.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('wares')
export class WaresController {
  constructor(private waresService: WaresService) {}

  @Get()
  getMainWares(): Promise<Ware[]> {
    return this.waresService.getMainWares();
  }

  @Get('my')
  getMyWares(@MyId() myId: number): Promise<Ware[]> {
    return this.waresService.getMyWares(myId);
  }

  @Get('placed')
  getPlacedWares(@MyId() myId: number): Promise<Ware[]> {
    return this.waresService.getPlacedWares(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllWares(): Promise<Ware[]> {
    return this.waresService.getAllWares();
  }

  @Post()
  createWare(@MyId() myId: number, @Body() dto: CreateWareDto): Promise<void> {
    return this.waresService.createWare({ ...dto, myId });
  }
}
