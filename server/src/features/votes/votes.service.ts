import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Vote } from './vote.entity';

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
