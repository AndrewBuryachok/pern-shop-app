import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ware } from './ware.entity';

@Injectable()
export class WaresService {
  constructor(
    @InjectRepository(Ware)
    private waresRepository: Repository<Ware>,
  ) {}
}
