import { Controller } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}
}
