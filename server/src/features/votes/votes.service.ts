import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Vote } from './vote.entity';
import { PollsService } from '../polls/polls.service';
import { ExtCreateVoteDto } from './vote.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { VoteError } from './vote-error.enum';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private pollsService: PollsService,
  ) {}

  async getMyVotes(myId: number, req: Request): Promise<Response<Vote>> {
    const [result, count] = await this.getVotesQueryBuilder(req)
      .andWhere('(voterUser.id = :myId OR pollerUser.id = :myId)', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllVotes(req: Request): Promise<Response<Vote>> {
    const [result, count] = await this.getVotesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createVote(dto: ExtCreateVoteDto): Promise<void> {
    await this.pollsService.checkPollNotCompleted(dto.pollId);
    const vote = await this.votesRepository.findOneBy({
      pollId: dto.pollId,
      userId: dto.myId,
    });
    if (!vote) {
      await this.create(dto);
    } else if (vote.type !== dto.type) {
      await this.update(vote);
    } else {
      await this.delete(vote);
    }
  }

  private async create(dto: ExtCreateVoteDto): Promise<void> {
    try {
      const vote = this.votesRepository.create({
        pollId: dto.pollId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.votesRepository.save(vote);
    } catch (error) {
      throw new AppException(VoteError.CREATE_FAILED);
    }
  }

  private async update(vote: Vote): Promise<void> {
    try {
      vote.type = !vote.type;
      await this.votesRepository.save(vote);
    } catch (error) {
      throw new AppException(VoteError.UPDATE_FAILED);
    }
  }

  private async delete(vote: Vote): Promise<void> {
    try {
      await this.votesRepository.remove(vote);
    } catch (error) {
      throw new AppException(VoteError.DELETE_FAILED);
    }
  }

  private getVotesQueryBuilder(req: Request): SelectQueryBuilder<Vote> {
    return this.votesRepository
      .createQueryBuilder('vote')
      .innerJoin('vote.poll', 'poll')
      .innerJoin('poll.user', 'pollerUser')
      .innerJoin('vote.user', 'voterUser')
      .where(
        '(voterUser.name ILIKE :search OR pollerUser.name ILIKE :search)',
        { search: `%${req.search || ''}%` },
      )
      .orderBy('vote.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'vote.id',
        'poll.id',
        'pollerUser.id',
        'pollerUser.name',
        'pollerUser.status',
        'poll.description',
        'voterUser.id',
        'voterUser.name',
        'voterUser.status',
        'vote.type',
        'vote.createdAt',
      ]);
  }
}
