import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CellsService } from './cells.service';
import { Cell } from './cell.entity';
import { CreateCellDto } from './cell.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('cells')
@Controller('cells')
export class CellsController {
  constructor(private cellsService: CellsService) {}

  @Public()
  @Get()
  getMainCells(@Query() req: Request): Promise<Response<Cell>> {
    return this.cellsService.getMainCells(req);
  }

  @Get('my')
  getMyCells(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Cell>> {
    return this.cellsService.getMyCells(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllCells(@Query() req: Request): Promise<Response<Cell>> {
    return this.cellsService.getAllCells(req);
  }

  @Post()
  createCell(@MyId() myId: number, @Body() dto: CreateCellDto): Promise<void> {
    return this.cellsService.createCell({ ...dto, myId });
  }
}
