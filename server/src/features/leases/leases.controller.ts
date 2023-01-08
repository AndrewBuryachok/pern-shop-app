import { Controller } from '@nestjs/common';
import { LeasesService } from './leases.service';

@Controller('leases')
export class LeasesController {
  constructor(private leasesService: LeasesService) {}
}
