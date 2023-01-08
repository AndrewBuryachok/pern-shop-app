import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from './storage.entity';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private storagesRepository: Repository<Storage>,
  ) {}
}
