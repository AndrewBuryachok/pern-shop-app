import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Vote } from './vote.entity';
import { PollsService } from '../polls/polls.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateVoteDto } from './vote.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { VoteError } from './vote-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private pollsService: PollsService,
    private mqttService: MqttService,
  ) {}

  async getMyVotes(myId: number, req: Request): Promise<Response<Vote>> {
    const [result, count] = await this.getVotesQueryBuilder(req)
      .andWhere('voterUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPolledVotes(myId: number, req: Request): Promise<Response<Vote>> {
    const [result, count] = await this.getVotesQueryBuilder(req)
      .andWhere('pollerUser.id = :myId', { myId })
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
    const poll = await this.pollsService.checkPollNotCompleted(dto.pollId);
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
    this.mqttService.publishNotificationMessage(
      poll.userId,
      Notification.CREATED_VOTE,
    );
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
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('vote.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.VOTER}`)
                  .andWhere('voterUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.POLLER}`)
                  .andWhere('pollerUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
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
            .where(`${!req.type}`)
            .orWhere('vote.type = :type', { type: req.type === 1 }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('vote.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('vote.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('vote.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'vote.id',
        'poll.id',
        'pollerUser.id',
        'pollerUser.nick',
        'poll.title',
        'poll.text',
        'voterUser.id',
        'voterUser.nick',
        'vote.type',
        'vote.createdAt',
      ]);
  }
}
