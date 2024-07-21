import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CellsService } from './cells.service';
import { Cell } from './cell.entity';
import { StorageTag } from '../storages-tags/storage-tag.entity';
import { CellIdDto, CreateCellDto } from './cell.dto';
import { StorageIdDto } from '../storages/storage.dto';
import { StorageTagIdDto } from '../storages-tags/storage-tag.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllCells(@Query() req: Request): Promise<Response<Cell>> {
    return this.cellsService.getAllCells(req);
  }

  @Public()
  @Get(':storageId/storages')
  selectStorageCells(@Param() { storageId }: StorageIdDto): Promise<Cell[]> {
    return this.cellsService.selectStorageCells(storageId);
  }

  @Public()
  @Get(':storageTagId/tags')
  selectTagCells(@Param() { storageTagId }: StorageTagIdDto): Promise<Cell[]> {
    return this.cellsService.selectTagCells(storageTagId);
  }

  @Public()
  @Get(':cellId/tag')
  selectCellTag(@Param() { cellId }: CellIdDto): Promise<StorageTag> {
    return this.cellsService.selectCellTag(cellId);
  }

  @Post()
  createCell(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateCellDto,
  ): Promise<void> {
    return this.cellsService.createCell({ ...dto, myId, hasRole });
  }
}
