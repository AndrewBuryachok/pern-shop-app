import { Body, Controller, Get, Post } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Vote } from './vote.entity';
import { CreateVoteDto } from './vote.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Get('my')
  getMyVotes(@MyId() myId: number): Promise<Vote[]> {
    return this.votesService.getMyVotes(myId);
  }

  @Get('polled')
  getPolledVotes(@MyId() myId: number): Promise<Vote[]> {
    return this.votesService.getPolledVotes(myId);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllVotes(): Promise<Vote[]> {
    return this.votesService.getAllVotes();
  }

  @Post()
  createVote(@MyId() myId: number, @Body() dto: CreateVoteDto): Promise<void> {
    return this.votesService.createVote({ ...dto, myId });
  }
}
