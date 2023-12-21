import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { ExtCreatePollDto, ExtPollIdDto, ExtVotePollDto } from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PollError } from './poll-error.enum';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async getMainPolls(req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadVotes(result);
    return { result, count };
  }

  async getMyPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadVotes(result);
    return { result, count };
  }

  async getVotedPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .innerJoinAndMapOne(
        'poll.myVote',
        'poll.votes',
        'myVote',
        'myVote.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    await this.loadVotes(result);
    return { result, count };
  }

  async getAllPolls(req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadVotes(result);
    return { result, count };
  }

  async createPoll(dto: ExtCreatePollDto): Promise<void> {
    await this.create(dto);
  }

  async completePoll(dto: ExtPollIdDto): Promise<void> {
    const poll = await this.checkPollOwner(dto.pollId, dto.myId, dto.hasRole);
    await this.complete(poll);
  }

  async deletePoll(dto: ExtPollIdDto): Promise<void> {
    const poll = await this.checkPollOwner(dto.pollId, dto.myId, dto.hasRole);
    await this.delete(poll);
  }

  async votePoll(dto: ExtVotePollDto): Promise<void> {
    const poll = await this.pollsRepository.findOneBy({ id: dto.pollId });
    if (poll.completedAt) {
      throw new AppException(PollError.ALREADY_COMPLETED);
    }
    const vote = await this.votesRepository.findOneBy({
      pollId: dto.pollId,
      userId: dto.myId,
    });
    if (!vote) {
      await this.addVote(dto);
    } else if (vote.type !== dto.type) {
      await this.updateVote(vote, dto);
    } else {
      await this.removeVote(vote);
    }
  }

  async checkPollExists(id: number): Promise<void> {
    await this.pollsRepository.findOneByOrFail({ id });
  }

  async checkPollOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Poll> {
    const poll = await this.pollsRepository.findOneBy({ id });
    if (poll.userId !== userId && !hasRole) {
      throw new AppException(PollError.NOT_OWNER);
    }
    if (poll.completedAt) {
      throw new AppException(PollError.ALREADY_COMPLETED);
    }
    return poll;
  }

  private async create(dto: ExtCreatePollDto): Promise<void> {
    try {
      const poll = this.pollsRepository.create({
        userId: dto.myId,
        title: dto.title,
        text: dto.text,
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

  private async addVote(dto: ExtVotePollDto): Promise<void> {
    try {
      const vote = this.votesRepository.create({
        pollId: dto.pollId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.votesRepository.save(vote);
    } catch (error) {
      throw new AppException(PollError.ADD_VOTE_FAILED);
    }
  }

  private async updateVote(vote: Vote, dto: ExtVotePollDto): Promise<void> {
    try {
      vote.type = dto.type;
      await this.votesRepository.save(vote);
    } catch (error) {
      throw new AppException(PollError.UPDATE_VOTE_FAILED);
    }
  }

  private async removeVote(vote: Vote): Promise<void> {
    try {
      await this.votesRepository.remove(vote);
    } catch (error) {
      throw new AppException(PollError.REMOVE_VOTE_FAILED);
    }
  }

  private async loadVotes(polls: Poll[]): Promise<void> {
    const promises = polls.map(async (poll) => {
      poll.votes = (
        await this.pollsRepository
          .createQueryBuilder('poll')
          .leftJoin('poll.votes', 'vote')
          .leftJoin('vote.user', 'user')
          .where('poll.id = :pollId', { pollId: poll.id })
          .orderBy('vote.id', 'DESC')
          .select(['poll.id', 'vote.id', 'user.id', 'user.nick', 'vote.type'])
          .getOne()
      ).votes;
    });
    await Promise.all(promises);
  }

  private getPollsQueryBuilder(req: Request): SelectQueryBuilder<Poll> {
    return this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoin('poll.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('poll.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('ownerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.title}`)
            .orWhere('poll.title ILIKE :title', { title: req.title }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('poll.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('poll.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('poll.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'poll.id',
        'ownerUser.id',
        'ownerUser.nick',
        'poll.title',
        'poll.text',
        'poll.createdAt',
        'poll.completedAt',
      ]);
  }
}
