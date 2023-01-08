import { Controller, Get } from '@nestjs/common';
import { CellsService } from './cells.service';
import { Cell } from './cell.entity';

@Controller('cells')
export class CellsController {
  constructor(private cellsService: CellsService) {}

  @Get()
  getMainCells(): Promise<Cell[]> {
    return this.cellsService.getMainCells();
  }

  @Get('my')
  getMyCells(myId: number): Promise<Cell[]> {
    return this.cellsService.getMyCells(myId);
  }

  @Get('all')
  getAllCells(): Promise<Cell[]> {
    return this.cellsService.getAllCells();
  }
}
