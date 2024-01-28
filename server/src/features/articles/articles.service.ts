import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from './article.entity';
import { Like } from './like.entity';
import { Comment } from '../comments/comment.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteArticleDto,
  ExtCreateArticleDto,
  ExtEditArticleDto,
  ExtLikeArticleDto,
} from './article.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ArticleError } from './article-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private mqttService: MqttService,
  ) {}

  async getMainArticles(req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyArticles(myId: number, req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSubscribedArticles(
    myId: number,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .innerJoinAndMapOne(
        'subscriber',
        'ownerUser.receivedSubscribers',
        'subscriber',
        'subscriber.id = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getLikedArticles(
    myId: number,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .innerJoinAndMapOne(
        'myLike',
        'article.likes',
        'myLike',
        'myLike.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getCommentedArticles(
    myId: number,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .innerJoinAndMapOne(
        'myComment',
        'article.comments',
        'myComment',
        'myComment.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllArticles(req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectLikedArticles(myId: number): Promise<Article[]> {
    return this.articlesRepository
      .createQueryBuilder('article')
      .innerJoinAndMapOne(
        'article.like',
        'article.likes',
        'myLike',
        'myLike.userId = :myId',
        { myId },
      )
      .select(['article.id', 'myLike.id', 'myLike.type'])
      .getMany();
  }

  async selectArticleLikes(articleId: number): Promise<Like[]> {
    const article = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoin('article.likes', 'like')
      .leftJoin('like.user', 'liker')
      .where('article.id = :articleId', { articleId })
      .orderBy('like.id', 'ASC')
      .select([
        'article.id',
        'like.id',
        'liker.id',
        'liker.nick',
        'liker.avatar',
        'like.type',
        'like.createdAt',
      ])
      .getOne();
    return article.likes;
  }

  async selectArticleComments(articleId: number): Promise<Comment[]> {
    const article = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoin('article.comments', 'comment')
      .leftJoin('comment.reply', 'reply')
      .leftJoin('reply.user', 'replier')
      .leftJoin('comment.user', 'commenter')
      .where('article.id = :articleId', { articleId })
      .orderBy('comment.id', 'ASC')
      .select([
        'article.id',
        'comment.id',
        'reply.id',
        'replier.id',
        'replier.nick',
        'replier.avatar',
        'reply.text',
        'commenter.id',
        'commenter.nick',
        'commenter.avatar',
        'comment.text',
        'comment.createdAt',
      ])
      .getOne();
    return article.comments;
  }

  async createArticle(dto: ExtCreateArticleDto): Promise<void> {
    const article = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      0,
      article.id,
      Notification.CREATED_ARTICLE,
    );
    this.mqttService.publishNotificationMention(
      dto.text,
      article.id,
      Notification.MENTIONED_ARTICLE,
    );
  }

  async editArticle(dto: ExtEditArticleDto): Promise<void> {
    const article = await this.checkArticleOwner(
      dto.articleId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(article, dto);
    this.mqttService.publishNotificationMention(
      dto.text,
      article.id,
      Notification.MENTIONED_ARTICLE,
    );
  }

  async deleteArticle(dto: DeleteArticleDto): Promise<void> {
    const article = await this.checkArticleOwner(
      dto.articleId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(article);
  }

  async likeArticle(dto: ExtLikeArticleDto): Promise<void> {
    const like = await this.likesRepository.findOneBy({
      articleId: dto.articleId,
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
      const article = await this.findArticleById(dto.articleId);
      this.mqttService.publishNotificationMessage(
        article.userId,
        dto.articleId,
        Notification.REACTED_ARTICLE,
      );
    }
  }

  async checkArticleExists(id: number): Promise<void> {
    await this.articlesRepository.findOneByOrFail({ id });
  }

  async checkArticleOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Article> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (article.userId !== userId && !hasRole) {
      throw new AppException(ArticleError.NOT_OWNER);
    }
    return article;
  }

  findArticleById(id: number): Promise<Article> {
    return this.articlesRepository.findOneBy({ id });
  }

  private async create(dto: ExtCreateArticleDto): Promise<Article> {
    try {
      const article = this.articlesRepository.create({
        userId: dto.userId,
        text: dto.text,
        image1: dto.image1,
        image2: dto.image2,
        image3: dto.image3,
        video: dto.video,
      });
      await this.articlesRepository.save(article);
      return article;
    } catch (error) {
      throw new AppException(ArticleError.CREATE_FAILED);
    }
  }

  private async edit(article: Article, dto: ExtEditArticleDto): Promise<void> {
    try {
      article.text = dto.text;
      article.image1 = dto.image1;
      article.image2 = dto.image2;
      article.image3 = dto.image3;
      article.video = dto.video;
      await this.articlesRepository.save(article);
    } catch (error) {
      throw new AppException(ArticleError.EDIT_FAILED);
    }
  }

  private async delete(article: Article): Promise<void> {
    try {
      await this.articlesRepository.remove(article);
    } catch (error) {
      throw new AppException(ArticleError.DELETE_FAILED);
    }
  }

  private async addLike(dto: ExtLikeArticleDto): Promise<void> {
    try {
      const like = this.likesRepository.create({
        articleId: dto.articleId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(ArticleError.ADD_LIKE_FAILED);
    }
  }

  private async updateLike(like: Like, dto: ExtLikeArticleDto): Promise<void> {
    try {
      like.type = dto.type;
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(ArticleError.UPDATE_LIKE_FAILED);
    }
  }

  private async removeLike(like: Like): Promise<void> {
    try {
      await this.likesRepository.remove(like);
    } catch (error) {
      throw new AppException(ArticleError.REMOVE_LIKE_FAILED);
    }
  }

  private getArticlesQueryBuilder(req: Request): SelectQueryBuilder<Article> {
    return this.articlesRepository
      .createQueryBuilder('article')
      .innerJoin('article.user', 'ownerUser')
      .loadRelationCountAndMap(
        'article.upLikes',
        'article.likes',
        'upLike',
        (qb) => qb.where('upLike.type'),
      )
      .loadRelationCountAndMap(
        'article.downLikes',
        'article.likes',
        'downLike',
        (qb) => qb.where('NOT downLike.type'),
      )
      .loadRelationCountAndMap('article.comments', 'article.comments')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('article.id = :id', { id: req.id }),
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
            .where(`${!req.minDate}`)
            .orWhere('article.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('article.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('article.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'article.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'article.text',
        'article.image1',
        'article.image2',
        'article.image3',
        'article.video',
        'article.createdAt',
      ]);
  }
}
