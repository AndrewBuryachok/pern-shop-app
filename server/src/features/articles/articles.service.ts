import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from './article.entity';
import { Like } from './like.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteArticleDto,
  ExtCreateArticleDto,
  ExtEditArticleDto,
  LikeArticleDto,
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
    await this.loadLikesAndComments(result);
    return { result, count };
  }

  async getMyArticles(myId: number, req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadLikesAndComments(result);
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
    await this.loadLikesAndComments(result);
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
    await this.loadLikesAndComments(result);
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
    await this.loadLikesAndComments(result);
    return { result, count };
  }

  async getAllArticles(req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadLikesAndComments(result);
    return { result, count };
  }

  async createArticle(dto: ExtCreateArticleDto): Promise<void> {
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      0,
      Notification.CREATED_ARTICLE,
    );
  }

  async editArticle(dto: ExtEditArticleDto): Promise<void> {
    const article = await this.checkArticleOwner(
      dto.articleId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(article, dto);
  }

  async deleteArticle(dto: DeleteArticleDto): Promise<void> {
    const article = await this.checkArticleOwner(
      dto.articleId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(article);
  }

  async likeArticle(dto: LikeArticleDto): Promise<void> {
    const like = await this.likesRepository.findOneBy({
      articleId: dto.articleId,
      userId: dto.myId,
    });
    if (like) {
      await this.unlike(like);
    } else {
      await this.like(dto);
    }
    const article = await this.findArticleById(dto.articleId);
    this.mqttService.publishNotificationMessage(
      article.userId,
      Notification.LIKED_ARTICLE,
    );
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

  private async create(dto: ExtCreateArticleDto): Promise<void> {
    try {
      const article = this.articlesRepository.create({
        userId: dto.myId,
        text: dto.text,
        image: dto.image,
      });
      await this.articlesRepository.save(article);
    } catch (error) {
      throw new AppException(ArticleError.CREATE_FAILED);
    }
  }

  private async edit(article: Article, dto: ExtEditArticleDto): Promise<void> {
    try {
      article.text = dto.text;
      article.image = dto.image;
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

  private async like(dto: LikeArticleDto): Promise<void> {
    try {
      const like = this.likesRepository.create({
        articleId: dto.articleId,
        userId: dto.myId,
      });
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(ArticleError.LIKE_FAILED);
    }
  }

  private async unlike(like: Like): Promise<void> {
    try {
      await this.likesRepository.remove(like);
    } catch (error) {
      throw new AppException(ArticleError.UNLIKE_FAILED);
    }
  }

  private async loadLikesAndComments(articles: Article[]): Promise<void> {
    const promises = articles.map(async (article) => {
      const result = await this.articlesRepository
        .createQueryBuilder('article')
        .leftJoin('article.likes', 'like')
        .leftJoin('like.user', 'liker')
        .leftJoin('article.comments', 'comment')
        .leftJoin('comment.user', 'commenter')
        .where('article.id = :articleId', { articleId: article.id })
        .orderBy('like.id', 'DESC')
        .addOrderBy('comment.id', 'DESC')
        .select([
          'article.id',
          'like.id',
          'liker.id',
          'liker.nick',
          'like.createdAt',
          'comment.id',
          'commenter.id',
          'commenter.nick',
          'comment.text',
          'comment.createdAt',
        ])
        .getOne();
      article.likes = result.likes;
      article.comments = result.comments;
    });
    await Promise.all(promises);
  }

  private getArticlesQueryBuilder(req: Request): SelectQueryBuilder<Article> {
    return this.articlesRepository
      .createQueryBuilder('article')
      .innerJoin('article.user', 'ownerUser')
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
        'article.text',
        'article.image',
        'article.createdAt',
      ]);
  }
}
