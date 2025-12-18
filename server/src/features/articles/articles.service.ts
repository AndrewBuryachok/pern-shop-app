import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from './article.entity';
import { View } from './view.entity';
import { Like } from './like.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteArticleDto,
  ExtCreateArticleDto,
  ExtEditArticleDto,
  ExtLikeArticleDto,
  ViewArticleDto,
} from './article.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ArticleError } from './article-error.enum';
import { Event, Notification } from '../../common/enums';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(View)
    private viewsRepository: Repository<View>,
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

  async getAllArticles(req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectAuthArticles(
    myId: number,
  ): Promise<{ view: number[]; up: number[]; down: number[] }> {
    const views = await this.viewsRepository.findBy({ userId: myId });
    const likes = await this.likesRepository.findBy({ userId: myId });
    return {
      view: views.map((view) => view.articleId),
      up: likes.filter((like) => like.type).map((like) => like.articleId),
      down: likes.filter((like) => !like.type).map((like) => like.articleId),
    };
  }

  selectArticleViews(articleId: number): Promise<View[]> {
    return this.selectViewsQueryBuilder()
      .where('view.articleId = :articleId', { articleId })
      .getMany();
  }

  selectArticleLikes(articleId: number): Promise<Like[]> {
    return this.selectLikesQueryBuilder()
      .where('like.articleId = :articleId', { articleId })
      .getMany();
  }

  async createArticle(dto: ExtCreateArticleDto): Promise<void> {
    const article = await this.create(dto);
    this.mqttService.publishNotification(
      article.id,
      0,
      dto.userId,
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
    this.mqttService.unpublishNotification(
      dto.articleId,
      0,
      article.userId,
      Notification.CREATED_ARTICLE,
    );
  }

  async viewArticle(dto: ViewArticleDto): Promise<void> {
    const view = await this.viewsRepository.findOneBy({
      articleId: dto.articleId,
      userId: dto.myId,
    });
    if (view) {
      throw new AppException(ArticleError.ALREADY_VIEWED);
    }
    const { id } = await this.addView(dto);
    const body = await this.selectViewsQueryBuilder()
      .where('view.id = :id', { id })
      .getOne();
    this.mqttService.publishEvent(
      0,
      Event.VIEWS,
      dto.articleId,
      JSON.stringify(body),
    );
  }

  async likeArticle(dto: ExtLikeArticleDto): Promise<void> {
    const like = await this.likesRepository.findOneBy({
      articleId: dto.articleId,
      userId: dto.myId,
    });
    const notify = !like || like.type !== dto.type;
    if (!like) {
      const { id } = await this.addLike(dto);
      const body = await this.selectLikesQueryBuilder()
        .where('like.id = :id', { id })
        .getOne();
      this.mqttService.publishEvent(
        0,
        Event.LIKES,
        dto.articleId,
        JSON.stringify(body),
      );
    } else if (like.type !== dto.type) {
      await this.updateLike(like, dto);
      const body = { id: like.id, type: like.type, toggle: true };
      this.mqttService.publishEvent(
        0,
        Event.LIKES,
        dto.articleId,
        JSON.stringify(body),
      );
    } else {
      const body = { id: like.id, type: like.type };
      await this.removeLike(like);
      this.mqttService.publishEvent(
        0,
        Event.LIKES,
        dto.articleId,
        JSON.stringify(body),
      );
    }
    if (notify) {
      const article = await this.findArticleById(dto.articleId);
      if (article.userId !== dto.myId) {
        this.mqttService.publishNotification(
          dto.articleId,
          article.userId,
          dto.myId,
          Notification.REACTED_ARTICLE,
        );
      }
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
        images: dto.images,
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
      article.images = dto.images;
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

  private async addView(dto: ViewArticleDto): Promise<View> {
    try {
      const view = this.viewsRepository.create({
        articleId: dto.articleId,
        userId: dto.myId,
      });
      await this.viewsRepository.save(view);
      return view;
    } catch (error) {
      throw new AppException(ArticleError.ADD_VIEW_FAILED);
    }
  }

  private async addLike(dto: ExtLikeArticleDto): Promise<Like> {
    try {
      const like = this.likesRepository.create({
        articleId: dto.articleId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.likesRepository.save(like);
      return like;
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

  private selectViewsQueryBuilder(): SelectQueryBuilder<View> {
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

  private selectLikesQueryBuilder(): SelectQueryBuilder<Like> {
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

  private getArticlesQueryBuilder(req: Request): SelectQueryBuilder<Article> {
    return this.articlesRepository
      .createQueryBuilder('article')
      .innerJoin('article.user', 'ownerUser')
      .loadRelationCountAndMap('article.views', 'article.views')
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
      .leftJoinAndMapOne(
        'article.comment',
        'article.comments',
        'comment',
        'comment.id = (SELECT MAX(c.id) FROM comments AS c WHERE c.article_id = article.id)',
      )
      .leftJoin('comment.user', 'commenter')
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
        'article.images',
        'comment.id',
        'commenter.id',
        'commenter.nick',
        'commenter.avatar',
        'comment.text',
        'comment.createdAt',
        'article.createdAt',
      ]);
  }
}
