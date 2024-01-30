import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { ArticlesService } from '../articles/articles.service';
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
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private articlesService: ArticlesService,
    private mqttService: MqttService,
  ) {}

  async createComment(
    dto: ExtCreateCommentDto & { nick: string },
  ): Promise<void> {
    await this.create(dto);
    const article = await this.articlesService.findArticleById(dto.articleId);
    this.mqttService.publishNotificationMessage(
      article.userId,
      dto.nick,
      Notification.COMMENTED_ARTICLE,
    );
    if (dto.commentId) {
      const reply = await this.commentsRepository.findOneBy({
        id: dto.commentId,
      });
      this.mqttService.publishNotificationMessage(
        reply.userId,
        dto.nick,
        Notification.REPLIED_COMMENT,
      );
    }
    await this.mqttService.publishNotificationMention(
      dto.text,
      dto.nick,
      Notification.MENTIONED_COMMENT,
    );
  }

  async editComment(dto: ExtEditCommentDto & { nick: string }): Promise<void> {
    const comment = await this.checkCommentOwner(
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(comment, dto);
    await this.mqttService.publishNotificationMention(
      dto.text,
      dto.nick,
      Notification.MENTIONED_COMMENT,
    );
  }

  async deleteComment(dto: DeleteCommentDto): Promise<void> {
    const comment = await this.checkCommentOwner(
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(comment);
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
}
