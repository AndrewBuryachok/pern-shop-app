import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
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
  private commentsRepositoryMap: Map<string, Repository<Comment>>;

  constructor(
    @InjectRepository(Comment, Database.DB1)
    private comments1Repository: Repository<Comment>,
    @InjectRepository(Comment, Database.DB2)
    private comments2Repository: Repository<Comment>,
    private articlesService: ArticlesService,
    private mqttService: MqttService,
  ) {
    this.commentsRepositoryMap = new Map(
      [this.comments1Repository, this.comments2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  selectArticleComments(
    project: string,
    articleId: number,
  ): Promise<Comment[]> {
    return this.selectCommentsQueryBuilder(project)
      .where('comment.articleId = :articleId', { articleId })
      .getMany();
  }

  async createComment(
    project: string,
    dto: ExtCreateCommentDto,
  ): Promise<void> {
    const { id } = await this.create(project, dto);
    const article = await this.articlesService.findArticleById(
      project,
      dto.articleId,
    );
    if (article.userId !== dto.myId) {
      this.mqttService.publishNotification(
        project,
        dto.articleId,
        article.userId,
        dto.myId,
        Notification.COMMENTED_ARTICLE,
      );
    }
    if (dto.commentId) {
      const reply = await this.commentsRepositoryMap.get(project).findOneBy({
        id: dto.commentId,
      });
      this.mqttService.publishNotification(
        project,
        dto.articleId,
        reply.userId,
        dto.myId,
        Notification.REPLIED_COMMENT,
      );
    }
    const body = await this.selectCommentsQueryBuilder(project)
      .where('comment.id = :id', { id })
      .getOne();
    this.mqttService.publishEvent(
      project,
      0,
      Event.COMMENTS,
      dto.articleId,
      JSON.stringify(body),
    );
  }

  async editComment(project: string, dto: ExtEditCommentDto): Promise<void> {
    const comment = await this.checkCommentOwner(
      project,
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(project, comment, dto);
    const body = { id: dto.commentId, text: dto.text };
    this.mqttService.publishEvent(
      project,
      0,
      Event.COMMENTS,
      comment.articleId,
      JSON.stringify(body),
    );
  }

  async deleteComment(project: string, dto: DeleteCommentDto): Promise<void> {
    const comment = await this.checkCommentOwner(
      project,
      dto.commentId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(project, comment);
    const body = { id: dto.commentId };
    this.mqttService.publishEvent(
      project,
      0,
      Event.COMMENTS,
      comment.articleId,
      JSON.stringify(body),
    );
  }

  async checkCommentExists(project: string, id: number): Promise<void> {
    await this.commentsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkCommentOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Comment> {
    const comment = await this.commentsRepositoryMap
      .get(project)
      .findOneBy({ id });
    if (comment.userId !== userId && !hasRole) {
      throw new AppException(CommentError.NOT_OWNER);
    }
    return comment;
  }

  private async create(
    project: string,
    dto: ExtCreateCommentDto,
  ): Promise<Comment> {
    try {
      const comment = this.commentsRepositoryMap.get(project).create({
        articleId: dto.articleId,
        replyId: dto.commentId || null,
        userId: dto.myId,
        text: dto.text,
      });
      await this.commentsRepositoryMap.get(project).save(comment);
      return comment;
    } catch (error) {
      throw new AppException(CommentError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    comment: Comment,
    dto: ExtEditCommentDto,
  ): Promise<void> {
    try {
      comment.text = dto.text;
      await this.commentsRepositoryMap.get(project).save(comment);
    } catch (error) {
      throw new AppException(CommentError.EDIT_FAILED);
    }
  }

  private async delete(project: string, comment: Comment): Promise<void> {
    try {
      await this.commentsRepositoryMap.get(project).remove(comment);
    } catch (error) {
      throw new AppException(CommentError.DELETE_FAILED);
    }
  }

  private selectCommentsQueryBuilder(
    project: string,
  ): SelectQueryBuilder<Comment> {
    return this.commentsRepositoryMap
      .get(project)
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
