import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PollComment } from './comment.entity';
import { PollsService } from './polls.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteCommentDto,
  ExtCreateCommentDto,
  ExtEditCommentDto,
} from './comment.dto';
import { AppException } from '../../common/exceptions';
import { CommentError } from './comment-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(PollComment)
    private commentsRepository: Repository<PollComment>,
    private pollsService: PollsService,
    private mqttService: MqttService,
  ) {}

  selectPollComments(pollId: number): Promise<PollComment[]> {
    return this.selectCommentsQueryBuilder()
      .where('comment.pollId = :pollId', { pollId })
      .getMany();
  }

  async createComment(
    dto: ExtCreateCommentDto & { nick: string },
  ): Promise<void> {
    await this.create(dto);
    const poll = await this.pollsService.findPollById(dto.pollId);
    this.mqttService.publishNotificationMessage(
      dto.pollId,
      poll.userId,
      dto.nick,
      Notification.COMMENTED_POLL,
    );
    if (dto.commentId) {
      const reply = await this.commentsRepository.findOneBy({
        id: dto.commentId,
      });
      this.mqttService.publishNotificationMessage(
        dto.pollId,
        reply.userId,
        dto.nick,
        Notification.REPLIED_POLL_COMMENT,
      );
    }
    await this.mqttService.publishNotificationMention(
      dto.pollId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_POLL_COMMENT,
    );
  }

  async editComment(dto: ExtEditCommentDto & { nick: string }): Promise<void> {
    const comment = await this.checkCommentOwner(
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.pollsService.checkPollNotCompleted(comment.pollId);
    await this.edit(comment, dto);
    await this.mqttService.publishNotificationMention(
      comment.pollId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_POLL_COMMENT,
    );
  }

  async deleteComment(dto: DeleteCommentDto): Promise<void> {
    const comment = await this.checkCommentOwner(
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.pollsService.checkPollNotCompleted(comment.pollId);
    await this.delete(comment);
  }

  async checkCommentExists(id: number): Promise<void> {
    await this.commentsRepository.findOneByOrFail({ id });
  }

  async checkCommentOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<PollComment> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (comment.userId !== userId && !hasRole) {
      throw new AppException(CommentError.NOT_OWNER);
    }
    return comment;
  }

  private async create(dto: ExtCreateCommentDto): Promise<PollComment> {
    try {
      const comment = this.commentsRepository.create({
        pollId: dto.pollId,
        replyId: dto.commentId || null,
        userId: dto.myId,
        text: dto.text,
      });
      await this.commentsRepository.save(comment);
      return comment;
    } catch (error) {
      throw new AppException(CommentError.CREATE_FAILED);
    }
  }

  private async edit(
    comment: PollComment,
    dto: ExtEditCommentDto,
  ): Promise<void> {
    try {
      comment.text = dto.text;
      await this.commentsRepository.save(comment);
    } catch (error) {
      throw new AppException(CommentError.EDIT_FAILED);
    }
  }

  private async delete(comment: PollComment): Promise<void> {
    try {
      await this.commentsRepository.remove(comment);
    } catch (error) {
      throw new AppException(CommentError.DELETE_FAILED);
    }
  }

  private selectCommentsQueryBuilder(): SelectQueryBuilder<PollComment> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.reply', 'reply')
      .leftJoin('reply.user', 'replier')
      .innerJoin('comment.user', 'commenter')
      .orderBy('comment.id', 'ASC')
      .select([
        'comment.id',
        'reply.id',
        'replier.id',
        'replier.nick',
        'replier.avatar',
        'reply.text',
        'reply.createdAt',
        'commenter.id',
        'commenter.nick',
        'commenter.avatar',
        'comment.text',
        'comment.createdAt',
      ]);
  }
}
