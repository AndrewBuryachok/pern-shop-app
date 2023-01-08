import { Controller } from '@nestjs/common';
import { RentsService } from './rents.service';

@Controller('rents')
export class RentsController {
  constructor(private rentsService: RentsService) {}
}
