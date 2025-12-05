import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Comment } from './comment.entity';
import { ArticlesService } from './articles.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteCommentDto,
  ExtCreateCommentDto,
  ExtEditCommentDto,
} from './comment.dto';
import { AppException } from '../../common/exceptions';
import { CommentError } from './comment-error.enum';
import { Event, Notification } from '../../common/enums';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private articlesService: ArticlesService,
    private mqttService: MqttService,
  ) {}

  selectArticleComments(articleId: number): Promise<Comment[]> {
    return this.selectCommentsQueryBuilder()
      .where('comment.articleId = :articleId', { articleId })
      .getMany();
  }

  async createComment(dto: ExtCreateCommentDto): Promise<void> {
    const { id } = await this.create(dto);
    const article = await this.articlesService.findArticleById(dto.articleId);
    if (article.userId !== dto.myId) {
      this.mqttService.publishNotification(
        dto.articleId,
        article.userId,
        dto.myId,
        Notification.COMMENTED_ARTICLE,
      );
    }
    if (dto.commentId) {
      const reply = await this.commentsRepository.findOneBy({
        id: dto.commentId,
      });
      this.mqttService.publishNotification(
        dto.articleId,
        reply.userId,
        dto.myId,
        Notification.REPLIED_COMMENT,
      );
    }
    const body = await this.selectCommentsQueryBuilder()
      .where('comment.id = :id', { id })
      .getOne();
    this.mqttService.publishEvent(
      0,
      Event.COMMENTS,
      dto.articleId,
      JSON.stringify(body),
    );
  }

  async editComment(dto: ExtEditCommentDto): Promise<void> {
    const comment = await this.checkCommentOwner(
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(comment, dto);
    const body = { id: dto.commentId, text: dto.text };
    this.mqttService.publishEvent(
      0,
      Event.COMMENTS,
      comment.articleId,
      JSON.stringify(body),
    );
  }

  async deleteComment(dto: DeleteCommentDto): Promise<void> {
    const comment = await this.checkCommentOwner(
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(comment);
    const body = { id: dto.commentId };
    this.mqttService.publishEvent(
      0,
      Event.COMMENTS,
      comment.articleId,
      JSON.stringify(body),
    );
  }

  async checkCommentExists(id: number): Promise<void> {
    await this.commentsRepository.findOneByOrFail({ id });
  }

  async checkCommentOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (comment.userId !== userId && !hasRole) {
      throw new AppException(CommentError.NOT_OWNER);
    }
    return comment;
  }

  private async create(dto: ExtCreateCommentDto): Promise<Comment> {
    try {
      const comment = this.commentsRepository.create({
        articleId: dto.articleId,
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

  private async edit(comment: Comment, dto: ExtEditCommentDto): Promise<void> {
    try {
      comment.text = dto.text;
      await this.commentsRepository.save(comment);
    } catch (error) {
      throw new AppException(CommentError.EDIT_FAILED);
    }
  }

  private async delete(comment: Comment): Promise<void> {
    try {
      await this.commentsRepository.remove(comment);
    } catch (error) {
      throw new AppException(CommentError.DELETE_FAILED);
    }
  }

  private selectCommentsQueryBuilder(): SelectQueryBuilder<Comment> {
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
