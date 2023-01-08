import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Poll } from './poll.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
  ) {}

  getMainPolls(myId: number): Promise<Poll[]> {
    return this.getPollsQueryBuilder(myId).getMany();
  }

  getMyPolls(myId: number): Promise<Poll[]> {
    return this.getPollsQueryBuilder(myId)
      .where('pollerUser.id = :myId', { myId })
      .getMany();
  }

  getAllPolls(myId: number): Promise<Poll[]> {
    return this.getPollsQueryBuilder(myId).getMany();
  }

  private getPollsQueryBuilder(myId: number): SelectQueryBuilder<Poll> {
    return this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoin('poll.user', 'pollerUser')
      .loadRelationCountAndMap('poll.upVotes', 'poll.votes', 'upVote', (qb) =>
        qb.where('upVote.type'),
      )
      .loadRelationCountAndMap(
        'poll.downVotes',
        'poll.votes',
        'downVote',
        (qb) => qb.where('NOT downVote.type'),
      )
      .leftJoinAndMapOne(
        'poll.myVote',
        'poll.votes',
        'myVote',
        'myVote.userId = :myId',
        { myId },
      )
      .orderBy('poll.id', 'DESC')
      .select([
        'poll.id',
        'pollerUser.id',
        'pollerUser.name',
        'poll.description',
        'poll.createdAt',
        'myVote.id',
        'myVote.type',
      ]);
  }
}
