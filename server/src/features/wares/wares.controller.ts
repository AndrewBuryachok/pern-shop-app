import { Controller } from '@nestjs/common';
import { WaresService } from './wares.service';

@Controller('wares')
export class WaresController {
  constructor(private waresService: WaresService) {}
}
