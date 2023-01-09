import { Body, Controller, Get, Post } from '@nestjs/common';
import { RentsService } from './rents.service';
import { Rent } from './rent.entity';
import { CreateRentDto } from './rent.dto';

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

  @Post()
  createRent(myId: number, @Body() dto: CreateRentDto): Promise<void> {
    return this.rentsService.createRent({ ...dto, myId });
  }
}
