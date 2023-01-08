import { Controller } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(private exchangesService: ExchangesService) {}
}
