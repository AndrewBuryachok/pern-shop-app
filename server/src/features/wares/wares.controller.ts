import { Controller, Get } from '@nestjs/common';
import { WaresService } from './wares.service';
import { Ware } from './ware.entity';

@Controller('wares')
export class WaresController {
  constructor(private waresService: WaresService) {}

  @Get()
  getMainWares(): Promise<Ware[]> {
    return this.waresService.getMainWares();
  }

  @Get('my')
  getMyWares(myId: number): Promise<Ware[]> {
    return this.waresService.getMyWares(myId);
  }

  @Get('placed')
  getPlacedWares(myId: number): Promise<Ware[]> {
    return this.waresService.getPlacedWares(myId);
  }

  @Get('all')
  getAllWares(): Promise<Ware[]> {
    return this.waresService.getAllWares();
  }
}
