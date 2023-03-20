import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Poll } from './poll.entity';
import { CompletePollDto, DeletePollDto, ExtCreatePollDto } from './poll.dto';
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

  async completePoll(dto: CompletePollDto): Promise<void> {
    const poll = await this.checkPollOwner(dto.pollId, dto.myId);
    if (poll.completedAt) {
      throw new AppException(PollError.ALREADY_COMPLETED);
    }
    await this.complete(poll);
  }

  async deletePoll(dto: DeletePollDto): Promise<void> {
    const poll = await this.checkPollOwner(dto.pollId, dto.myId);
    if (poll.completedAt) {
      throw new AppException(PollError.ALREADY_COMPLETED);
    }
    await this.delete(poll);
  }

  async checkPollExists(id: number): Promise<void> {
    await this.pollsRepository.findOneByOrFail({ id });
  }

  async checkPollOwner(id: number, userId: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOneBy({ id, userId });
    if (!poll) {
      throw new AppException(PollError.NOT_OWNER);
    }
    return poll;
  }

  async checkPollNotCompleted(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOneBy({ id });
    if (poll.completedAt) {
      throw new AppException(PollError.ALREADY_COMPLETED);
    }
    return poll;
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

  private async complete(poll: Poll): Promise<void> {
    try {
      poll.completedAt = new Date();
      await this.pollsRepository.save(poll);
    } catch (error) {
      throw new AppException(PollError.COMPLETE_FAILED);
    }
  }

  private async delete(poll: Poll): Promise<void> {
    try {
      await this.pollsRepository.remove(poll);
    } catch (error) {
      throw new AppException(PollError.DELETE_FAILED);
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
        'pollerUser.status',
        'poll.description',
        'poll.createdAt',
        'poll.completedAt',
        'myVote.id',
        'myVote.type',
      ]);
  }
}
