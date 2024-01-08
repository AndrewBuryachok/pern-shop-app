import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { Discussion } from '../discussions/discussion.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeletePollDto,
  ExtCompletePollDto,
  ExtCreatePollDto,
  ExtVotePollDto,
} from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PollError } from './poll-error.enum';
import { Result } from './result.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private mqttService: MqttService,
  ) {}

  async getMainPolls(req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getVotedPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .innerJoinAndMapOne(
        'myVote',
        'poll.votes',
        'myVote',
        'myVote.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getDiscussedPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .innerJoinAndMapOne(
        'myDiscussion',
        'poll.discussions',
        'myDiscussion',
        'myDiscussion.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllPolls(req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectVotedPolls(myId: number): Promise<Poll[]> {
    return this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoinAndMapOne(
        'poll.vote',
        'poll.votes',
        'myVote',
        'myVote.userId = :myId',
        { myId },
      )
      .select(['poll.id', 'myVote.id', 'myVote.type'])
      .getMany();
  }

  async selectPollVotes(pollId: number): Promise<Vote[]> {
    const poll = await this.pollsRepository
      .createQueryBuilder('poll')
      .leftJoin('poll.votes', 'vote')
      .leftJoin('vote.user', 'voter')
      .where('poll.id = :pollId', { pollId })
      .orderBy('vote.id', 'DESC')
      .select([
        'poll.id',
        'vote.id',
        'voter.id',
        'voter.nick',
        'voter.avatar',
        'vote.type',
        'vote.createdAt',
      ])
      .getOne();
    return poll.votes;
  }

  async selectPollDiscussions(pollId: number): Promise<Discussion[]> {
    const poll = await this.pollsRepository
      .createQueryBuilder('poll')
      .leftJoin('poll.discussions', 'discussion')
      .leftJoin('discussion.user', 'discussioner')
      .where('poll.id = :pollId', { pollId })
      .orderBy('discussion.id', 'DESC')
      .select([
        'poll.id',
        'discussion.id',
        'discussioner.id',
        'discussioner.nick',
        'discussioner.avatar',
        'discussion.text',
        'discussion.createdAt',
      ])
      .getOne();
    return poll.discussions;
  }

  async createPoll(dto: ExtCreatePollDto): Promise<void> {
    await this.create(dto);
    this.mqttService.publishNotificationMessage(0, Notification.CREATED_POLL);
  }

  async completePoll(dto: ExtCompletePollDto): Promise<void> {
    const poll = await this.pollsRepository.findOneBy({ id: dto.pollId });
    await this.complete(poll, dto);
    this.mqttService.publishNotificationMessage(
      poll.userId,
      Notification.COMPLETED_POLL,
    );
  }

  async deletePoll(dto: DeletePollDto): Promise<void> {
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
    this.mqttService.publishNotificationMessage(
      poll.userId,
      Notification.VOTED_POLL,
    );
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
        title: dto.title,
        text: dto.text,
      });
      await this.pollsRepository.save(poll);
    } catch (error) {
      throw new AppException(PollError.CREATE_FAILED);
    }
  }

  private async complete(poll: Poll, dto: ExtCompletePollDto): Promise<void> {
    try {
      poll.result = dto.result;
      poll.completedAt = poll.result === Result.PROGRESS ? null : new Date();
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

  private getPollsQueryBuilder(req: Request): SelectQueryBuilder<Poll> {
    return this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoin('poll.user', 'ownerUser')
      .loadRelationCountAndMap('poll.upVotes', 'poll.votes', 'upVote', (qb) =>
        qb.where('upVote.type'),
      )
      .loadRelationCountAndMap(
        'poll.downVotes',
        'poll.votes',
        'downVote',
        (qb) => qb.where('NOT downVote.type'),
      )
      .loadRelationCountAndMap('poll.discussions', 'poll.discussions')
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
            .where(`${!req.result}`)
            .orWhere('poll.result = :result', { result: req.result }),
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
        'ownerUser.avatar',
        'poll.title',
        'poll.text',
        'poll.result',
        'poll.createdAt',
        'poll.completedAt',
      ]);
  }
}
