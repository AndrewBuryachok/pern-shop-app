import { Controller, Get } from '@nestjs/common';
import { RentsService } from './rents.service';
import { Rent } from './rent.entity';

@Controller('rents')
export class RentsController {
  constructor(private rentsService: RentsService) {}

  @Get('my')
  getMyRents(myId: number): Promise<Rent[]> {
    return this.rentsService.getMyRents(myId);
  }

  @Get('all')
  getAllRents(): Promise<Rent[]> {
    return this.rentsService.getAllRents();
  }

  @Get('my/select')
  selectMyRents(myId: number): Promise<Rent[]> {
    return this.rentsService.selectMyRents(myId);
  }
}
