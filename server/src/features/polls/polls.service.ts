import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Poll } from './poll.entity';
import { PollView } from './poll-view.entity';
import { PollLike } from './poll-like.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeletePollDto,
  ExtCompletePollDto,
  ExtCreatePollDto,
  ExtEditPollDto,
  ExtLikePollDto,
  ViewPollDto,
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
    @InjectRepository(PollView)
    private viewsRepository: Repository<PollView>,
    @InjectRepository(PollLike)
    private likesRepository: Repository<PollLike>,
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

  async getLikedPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .innerJoinAndMapOne(
        'myLike',
        'poll.likes',
        'myLike',
        'myLike.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getCommentedPolls(myId: number, req: Request): Promise<Response<Poll>> {
    const [result, count] = await this.getPollsQueryBuilder(req)
      .innerJoinAndMapOne(
        'myComment',
        'poll.comments',
        'myComment',
        'myComment.userId = :myId',
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

  async selectViewedPolls(myId: number): Promise<number[]> {
    const polls = await this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoinAndMapOne(
        'myView',
        'poll.views',
        'myView',
        'myView.userId = :myId',
        { myId },
      )
      .select(['poll.id'])
      .getMany();
    return polls.map((poll) => poll.id);
  }

  selectLikedPolls(myId: number): Promise<Poll[]> {
    return this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoinAndMapOne(
        'poll.like',
        'poll.likes',
        'myLike',
        'myLike.userId = :myId',
        { myId },
      )
      .select(['poll.id', 'myLike.id', 'myLike.type'])
      .getMany();
  }

  selectPollViews(pollId: number): Promise<PollView[]> {
    return this.selectPollsViewsQueryBuilder()
      .where('view.pollId = :pollId', { pollId })
      .getMany();
  }

  selectPollLikes(pollId: number, type: boolean): Promise<PollLike[]> {
    return this.selectLikesQueryBuilder()
      .where('like.pollId = :pollId', { pollId })
      .andWhere('like.type = :type', { type })
      .getMany();
  }

  async createPoll(dto: ExtCreatePollDto & { nick: string }): Promise<void> {
    const poll = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      poll.id,
      0,
      dto.nick,
      Notification.CREATED_POLL,
    );
    await this.mqttService.publishNotificationMention(
      poll.id,
      dto.text,
      dto.nick,
      Notification.MENTIONED_POLL,
    );
  }

  async editPoll(dto: ExtEditPollDto & { nick: string }): Promise<void> {
    const poll = await this.checkPollOwner(dto.pollId, dto.myId, dto.hasRole);
    await this.edit(poll, dto);
    await this.mqttService.publishNotificationMention(
      dto.pollId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_POLL,
    );
  }

  async completePoll(
    dto: ExtCompletePollDto & { nick: string },
  ): Promise<void> {
    const poll = await this.checkPollNotCompleted(dto.pollId);
    await this.complete(poll, dto);
    this.mqttService.publishNotificationMessage(
      dto.pollId,
      poll.userId,
      dto.nick,
      Notification.COMPLETED_POLL,
    );
  }

  async deletePoll(dto: DeletePollDto): Promise<void> {
    const poll = await this.checkPollOwner(dto.pollId, dto.myId, dto.hasRole);
    await this.delete(poll);
  }

  async viewPoll(dto: ViewPollDto): Promise<void> {
    const view = await this.viewsRepository.findOneBy({
      pollId: dto.pollId,
      userId: dto.myId,
    });
    if (view) {
      throw new AppException(PollError.ALREADY_VIEWED);
    }
    await this.addView(dto);
  }

  async likePoll(dto: ExtLikePollDto & { nick: string }): Promise<void> {
    const like = await this.likesRepository.findOneBy({
      pollId: dto.pollId,
      userId: dto.myId,
    });
    const notify = !like || like.type !== dto.type;
    if (!like) {
      await this.addLike(dto);
    } else if (like.type !== dto.type) {
      await this.updateLike(like, dto);
    } else {
      await this.removeLike(like);
    }
    if (notify) {
      const poll = await this.findPollById(dto.pollId);
      this.mqttService.publishNotificationMessage(
        dto.pollId,
        poll.userId,
        dto.nick,
        Notification.REACTED_POLL,
      );
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

  async checkPollNotCompleted(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOneBy({ id });
    if (poll.completedAt) {
      throw new AppException(PollError.ALREADY_COMPLETED);
    }
    return poll;
  }

  findPollById(id: number): Promise<Poll> {
    return this.pollsRepository.findOneBy({ id });
  }

  private async create(dto: ExtCreatePollDto): Promise<Poll> {
    try {
      const poll = this.pollsRepository.create({
        userId: dto.userId,
        text: dto.text,
        mark: dto.mark,
        image: dto.image,
        video: dto.video,
      });
      await this.pollsRepository.save(poll);
      return poll;
    } catch (error) {
      throw new AppException(PollError.CREATE_FAILED);
    }
  }

  private async edit(poll: Poll, dto: ExtEditPollDto): Promise<void> {
    try {
      poll.text = dto.text;
      poll.mark = dto.mark;
      poll.image = dto.image;
      poll.video = dto.video;
      await this.pollsRepository.save(poll);
    } catch (error) {
      throw new AppException(PollError.EDIT_FAILED);
    }
  }

  private async complete(poll: Poll, dto: ExtCompletePollDto): Promise<void> {
    try {
      poll.result = dto.type ? Result.APPROVED : Result.REJECTED;
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

  private async addView(dto: ViewPollDto): Promise<void> {
    try {
      const view = this.viewsRepository.create({
        pollId: dto.pollId,
        userId: dto.myId,
      });
      await this.viewsRepository.save(view);
    } catch (error) {
      throw new AppException(PollError.ADD_VIEW_FAILED);
    }
  }

  private async addLike(dto: ExtLikePollDto): Promise<void> {
    try {
      const like = this.likesRepository.create({
        pollId: dto.pollId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(PollError.ADD_LIKE_FAILED);
    }
  }

  private async updateLike(like: PollLike, dto: ExtLikePollDto): Promise<void> {
    try {
      like.type = dto.type;
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(PollError.UPDATE_LIKE_FAILED);
    }
  }

  private async removeLike(like: PollLike): Promise<void> {
    try {
      await this.likesRepository.remove(like);
    } catch (error) {
      throw new AppException(PollError.REMOVE_LIKE_FAILED);
    }
  }

  private selectPollsViewsQueryBuilder(): SelectQueryBuilder<PollView> {
    return this.viewsRepository
      .createQueryBuilder('view')
      .innerJoin('view.user', 'viewer')
      .orderBy('view.id', 'DESC')
      .select([
        'view.id',
        'viewer.id',
        'viewer.nick',
        'viewer.avatar',
        'view.createdAt',
      ]);
  }

  private selectLikesQueryBuilder(): SelectQueryBuilder<PollLike> {
    return this.likesRepository
      .createQueryBuilder('like')
      .innerJoin('like.user', 'liker')
      .orderBy('like.id', 'DESC')
      .select([
        'like.id',
        'liker.id',
        'liker.nick',
        'liker.avatar',
        'like.type',
        'like.createdAt',
      ]);
  }

  private getPollsQueryBuilder(req: Request): SelectQueryBuilder<Poll> {
    return this.pollsRepository
      .createQueryBuilder('poll')
      .innerJoin('poll.user', 'ownerUser')
      .loadRelationCountAndMap('poll.views', 'poll.views')
      .loadRelationCountAndMap('poll.upLikes', 'poll.likes', 'upLike', (qb) =>
        qb.where('upLike.type'),
      )
      .loadRelationCountAndMap(
        'poll.downLikes',
        'poll.likes',
        'downLike',
        (qb) => qb.where('NOT downLike.type'),
      )
      .loadRelationCountAndMap('poll.comments', 'poll.comments')
      .leftJoinAndMapOne(
        'poll.comment',
        'poll.comments',
        'comment',
        'comment.id = (SELECT MAX(d.id) FROM polls_comments AS d WHERE d.poll_id = poll.id)',
      )
      .leftJoin('comment.user', 'commenter')
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
            .where(`${!req.mark}`)
            .orWhere('poll.mark = :mark', { mark: req.mark }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('poll.completedAt IS NOT NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('poll.completedAt IS NULL'),
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
        'poll.text',
        'poll.mark',
        'poll.image',
        'poll.video',
        'poll.result',
        'comment.id',
        'commenter.id',
        'commenter.nick',
        'commenter.avatar',
        'comment.text',
        'comment.createdAt',
        'poll.createdAt',
        'poll.completedAt',
      ]);
  }
}
