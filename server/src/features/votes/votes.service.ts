import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Vote } from './vote.entity';
import { ExtCreateVoteDto } from './vote.dto';
import { AppException } from '../../common/exceptions';
import { VoteError } from './vote-error.enum';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  getMyVotes(myId: number): Promise<Vote[]> {
    return this.getVotesQueryBuilder()
      .where('voterUser.id = :myId', { myId })
      .getMany();
  }

  getPolledVotes(myId: number): Promise<Vote[]> {
    return this.getVotesQueryBuilder()
      .where('pollerUser.id = :myId', { myId })
      .getMany();
  }

  getAllVotes(): Promise<Vote[]> {
    return this.getVotesQueryBuilder().getMany();
  }

  async createVote(dto: ExtCreateVoteDto): Promise<void> {
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

  private getVotesQueryBuilder(): SelectQueryBuilder<Vote> {
    return this.votesRepository
      .createQueryBuilder('vote')
      .innerJoin('vote.poll', 'poll')
      .innerJoin('poll.user', 'pollerUser')
      .innerJoin('vote.user', 'voterUser')
      .orderBy('vote.id', 'DESC')
      .select([
        'vote.id',
        'poll.id',
        'pollerUser.id',
        'pollerUser.name',
        'poll.description',
        'voterUser.id',
        'voterUser.name',
        'vote.type',
        'vote.createdAt',
      ]);
  }
}
