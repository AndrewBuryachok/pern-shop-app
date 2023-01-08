import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './trade.entity';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
  ) {}
}
