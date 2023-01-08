import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class LeasesService {
  constructor(
    @InjectRepository(Product)
    private leasesRepository: Repository<Product>,
  ) {}
}
