import { Controller, Get } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Vote } from './vote.entity';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Get('my')
  getMyVotes(myId: number): Promise<Vote[]> {
    return this.votesService.getMyVotes(myId);
  }

  @Get('polled')
  getPolledVotes(myId: number): Promise<Vote[]> {
    return this.votesService.getPolledVotes(myId);
  }

  @Get('all')
  getAllVotes(): Promise<Vote[]> {
    return this.votesService.getAllVotes();
  }
}
