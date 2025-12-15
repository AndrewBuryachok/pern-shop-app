import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
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
  private articlesRepositoryMap: Map<string, Repository<Article>>;
  private viewsRepositoryMap: Map<string, Repository<View>>;
  private likesRepositoryMap: Map<string, Repository<Like>>;

  constructor(
    @InjectRepository(Article, Database.DB1)
    private articles1Repository: Repository<Article>,
    @InjectRepository(Article, Database.DB2)
    private articles2Repository: Repository<Article>,
    @InjectRepository(View, Database.DB1)
    private views1Repository: Repository<View>,
    @InjectRepository(View, Database.DB2)
    private views2Repository: Repository<View>,
    @InjectRepository(Like, Database.DB1)
    private likes1Repository: Repository<Like>,
    @InjectRepository(Like, Database.DB2)
    private likes2Repository: Repository<Like>,
    private mqttService: MqttService,
  ) {
    this.articlesRepositoryMap = new Map(
      [this.articles1Repository, this.articles2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
    this.viewsRepositoryMap = new Map(
      [this.views1Repository, this.views2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
    this.likesRepositoryMap = new Map(
      [this.likes1Repository, this.likes2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainArticles(
    project: string,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyArticles(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(project, req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllArticles(
    project: string,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectAuthArticles(
    project: string,
    myId: number,
  ): Promise<{ view: number[]; up: number[]; down: number[] }> {
    const views = await this.viewsRepositoryMap
      .get(project)
      .findBy({ userId: myId });
    const likes = await this.likesRepositoryMap
      .get(project)
      .findBy({ userId: myId });
    return {
      view: views.map((view) => view.articleId),
      up: likes.filter((like) => like.type).map((like) => like.articleId),
      down: likes.filter((like) => !like.type).map((like) => like.articleId),
    };
  }

  selectArticleViews(project: string, articleId: number): Promise<View[]> {
    return this.selectViewsQueryBuilder(project)
      .where('view.articleId = :articleId', { articleId })
      .getMany();
  }

  selectArticleLikes(project: string, articleId: number): Promise<Like[]> {
    return this.selectLikesQueryBuilder(project)
      .where('like.articleId = :articleId', { articleId })
      .getMany();
  }

  async createArticle(
    project: string,
    dto: ExtCreateArticleDto,
  ): Promise<void> {
    const article = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      article.id,
      0,
      dto.userId,
      Notification.CREATED_ARTICLE,
    );
  }

  async editArticle(project: string, dto: ExtEditArticleDto): Promise<void> {
    const article = await this.checkArticleOwner(
      project,
      dto.articleId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(project, article, dto);
  }

  async deleteArticle(project: string, dto: DeleteArticleDto): Promise<void> {
    const article = await this.checkArticleOwner(
      project,
      dto.articleId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(project, article);
    this.mqttService.unpublishNotification(
      project,
      dto.articleId,
      0,
      article.userId,
      Notification.CREATED_ARTICLE,
    );
  }

  async viewArticle(project: string, dto: ViewArticleDto): Promise<void> {
    const view = await this.viewsRepositoryMap.get(project).findOneBy({
      articleId: dto.articleId,
      userId: dto.myId,
    });
    if (view) {
      throw new AppException(ArticleError.ALREADY_VIEWED);
    }
    const { id } = await this.addView(project, dto);
    const body = await this.selectViewsQueryBuilder(project)
      .where('view.id = :id', { id })
      .getOne();
    this.mqttService.publishEvent(
      project,
      0,
      Event.VIEWS,
      dto.articleId,
      JSON.stringify(body),
    );
  }

  async likeArticle(project: string, dto: ExtLikeArticleDto): Promise<void> {
    const like = await this.likesRepositoryMap.get(project).findOneBy({
      articleId: dto.articleId,
      userId: dto.myId,
    });
    const notify = !like || like.type !== dto.type;
    if (!like) {
      const { id } = await this.addLike(project, dto);
      const body = await this.selectLikesQueryBuilder(project)
        .where('like.id = :id', { id })
        .getOne();
      this.mqttService.publishEvent(
        project,
        0,
        Event.LIKES,
        dto.articleId,
        JSON.stringify(body),
      );
    } else if (like.type !== dto.type) {
      await this.updateLike(project, like, dto);
      const body = { id: like.id, type: like.type, toggle: true };
      this.mqttService.publishEvent(
        project,
        0,
        Event.LIKES,
        dto.articleId,
        JSON.stringify(body),
      );
    } else {
      const body = { id: like.id, type: like.type };
      await this.removeLike(project, like);
      this.mqttService.publishEvent(
        project,
        0,
        Event.LIKES,
        dto.articleId,
        JSON.stringify(body),
      );
    }
    if (notify) {
      const article = await this.findArticleById(project, dto.articleId);
      if (article.userId !== dto.myId) {
        this.mqttService.publishNotification(
          project,
          dto.articleId,
          article.userId,
          dto.myId,
          Notification.REACTED_ARTICLE,
        );
      }
    }
  }

  async checkArticleExists(project: string, id: number): Promise<void> {
    await this.articlesRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkArticleOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Article> {
    const article = await this.articlesRepositoryMap
      .get(project)
      .findOneBy({ id });
    if (article.userId !== userId && !hasRole) {
      throw new AppException(ArticleError.NOT_OWNER);
    }
    return article;
  }

  findArticleById(project: string, id: number): Promise<Article> {
    return this.articlesRepositoryMap.get(project).findOneBy({ id });
  }

  private async create(
    project: string,
    dto: ExtCreateArticleDto,
  ): Promise<Article> {
    try {
      const article = this.articlesRepositoryMap.get(project).create({
        userId: dto.userId,
        text: dto.text,
        images: dto.images,
      });
      await this.articlesRepositoryMap.get(project).save(article);
      return article;
    } catch (error) {
      throw new AppException(ArticleError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    article: Article,
    dto: ExtEditArticleDto,
  ): Promise<void> {
    try {
      article.text = dto.text;
      article.images = dto.images;
      await this.articlesRepositoryMap.get(project).save(article);
    } catch (error) {
      throw new AppException(ArticleError.EDIT_FAILED);
    }
  }

  private async delete(project: string, article: Article): Promise<void> {
    try {
      await this.articlesRepositoryMap.get(project).remove(article);
    } catch (error) {
      throw new AppException(ArticleError.DELETE_FAILED);
    }
  }

  private async addView(project: string, dto: ViewArticleDto): Promise<View> {
    try {
      const view = this.viewsRepositoryMap.get(project).create({
        articleId: dto.articleId,
        userId: dto.myId,
      });
      await this.viewsRepositoryMap.get(project).save(view);
      return view;
    } catch (error) {
      throw new AppException(ArticleError.ADD_VIEW_FAILED);
    }
  }

  private async addLike(
    project: string,
    dto: ExtLikeArticleDto,
  ): Promise<Like> {
    try {
      const like = this.likesRepositoryMap.get(project).create({
        articleId: dto.articleId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.likesRepositoryMap.get(project).save(like);
      return like;
    } catch (error) {
      throw new AppException(ArticleError.ADD_LIKE_FAILED);
    }
  }

  private async updateLike(
    project: string,
    like: Like,
    dto: ExtLikeArticleDto,
  ): Promise<void> {
    try {
      like.type = dto.type;
      await this.likesRepositoryMap.get(project).save(like);
    } catch (error) {
      throw new AppException(ArticleError.UPDATE_LIKE_FAILED);
    }
  }

  private async removeLike(project: string, like: Like): Promise<void> {
    try {
      await this.likesRepositoryMap.get(project).remove(like);
    } catch (error) {
      throw new AppException(ArticleError.REMOVE_LIKE_FAILED);
    }
  }

  private selectViewsQueryBuilder(project: string): SelectQueryBuilder<View> {
    return this.viewsRepositoryMap
      .get(project)
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

  private selectLikesQueryBuilder(project: string): SelectQueryBuilder<Like> {
    return this.likesRepositoryMap
      .get(project)
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

  private getArticlesQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Article> {
    return this.articlesRepositoryMap
      .get(project)
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
