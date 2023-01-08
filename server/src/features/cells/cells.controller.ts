import { Controller } from '@nestjs/common';
import { CellsService } from './cells.service';

@Controller('cells')
export class CellsController {
  constructor(private cellsService: CellsService) {}
}
