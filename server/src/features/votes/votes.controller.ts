import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { Vote } from './vote.entity';
import { CreateVoteDto } from './vote.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Get('my')
  getMyVotes(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Vote>> {
    return this.votesService.getMyVotes(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllVotes(@Query() req: Request): Promise<Response<Vote>> {
    return this.votesService.getAllVotes(req);
  }

  @Post()
  createVote(@MyId() myId: number, @Body() dto: CreateVoteDto): Promise<void> {
    return this.votesService.createVote({ ...dto, myId });
  }
}
