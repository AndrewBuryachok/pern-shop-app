import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Poll } from './poll.entity';
import { ExtCreatePollDto } from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PollError } from './poll-error.enum';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
  ) {}

  async getMainPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(
      myId,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(myId, req)
      .andWhere('pollerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(
      myId,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createPoll(dto: ExtCreatePollDto): Promise<void> {
    await this.create(dto);
  }

  async checkPollExists(id: number): Promise<void> {
    await this.pollsRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreatePollDto): Promise<void> {
    try {
      const poll = this.pollsRepository.create({
        userId: dto.myId,
        description: dto.description,
      });
      await this.pollsRepository.save(poll);
    } catch (error) {
      throw new AppException(PollError.CREATE_FAILED);
    }
  }

  private getPollsQueryBuilder(
    myId: number,
    req: Request,
  ): SelectQueryBuilder<Poll> {
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
      .where('pollerUser.name ILIKE :search', {
        search: `%${req.search || ''}%`,
      })
      .orderBy('poll.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
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
