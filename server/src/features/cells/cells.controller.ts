import { Body, Controller, Get, Post } from '@nestjs/common';
import { CellsService } from './cells.service';
import { Cell } from './cell.entity';
import { CreateCellDto } from './cell.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('cells')
export class CellsController {
  constructor(private cellsService: CellsService) {}

  @Get()
  getMainCells(): Promise<Cell[]> {
    return this.cellsService.getMainCells();
  }

  @Get('my')
  getMyCells(@MyId() myId: number): Promise<Cell[]> {
    return this.cellsService.getMyCells(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllCells(): Promise<Cell[]> {
    return this.cellsService.getAllCells();
  }

  @Post()
  createCell(@MyId() myId: number, @Body() dto: CreateCellDto): Promise<void> {
    return this.cellsService.createCell({ ...dto, myId });
  }
}
