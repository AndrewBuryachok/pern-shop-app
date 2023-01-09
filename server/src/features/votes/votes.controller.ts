import { Body, Controller, Get, Post } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Vote } from './vote.entity';
import { CreateVoteDto } from './vote.dto';

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

  @Post()
  createVote(myId: number, @Body() dto: CreateVoteDto): Promise<void> {
    return this.votesService.createVote({ ...dto, myId });
  }
}
