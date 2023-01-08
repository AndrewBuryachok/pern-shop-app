import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cell } from './cell.entity';

@Injectable()
export class CellsService {
  constructor(
    @InjectRepository(Cell)
    private cellsRepository: Repository<Cell>,
  ) {}
}
