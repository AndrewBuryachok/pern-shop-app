import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from './article.entity';
import { Like } from './like.entity';
import {
  DeleteArticleDto,
  ExtCreateArticleDto,
  ExtEditArticleDto,
  LikeArticleDto,
} from './article.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ArticleError } from './article-error.enum';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async getMainArticles(req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadLikes(result);
    return { result, count };
  }

  async getMyArticles(myId: number, req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadLikes(result);
    return { result, count };
  }

  async getLikedArticles(
    myId: number,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .innerJoinAndMapOne(
        'article.myLike',
        'article.likes',
        'myLike',
        'myLike.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    await this.loadLikes(result);
    return { result, count };
  }

  async getFollowedArticles(
    myId: number,
    req: Request,
  ): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(req)
      .leftJoinAndMapMany(
        'ownerUser.followings',
        'followings',
        'following',
        'ownerUser.id = following.receiver_user_id',
      )
      .andWhere('following.sender_user_id = :myId', { myId })
      .getManyAndCount();
    await this.loadLikes(result);
    return { result, count };
  }

  async getAllArticles(req: Request): Promise<Response<Article>> {
    const [result, count] = await this.getArticlesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadLikes(result);
    return { result, count };
  }

  async createArticle(dto: ExtCreateArticleDto): Promise<void> {
    await this.create(dto);
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

  private async loadLikes(articles: Article[]): Promise<void> {
    const promises = articles.map(async (article) => {
      article.likes = (
        await this.articlesRepository
          .createQueryBuilder('article')
          .leftJoin('article.likes', 'like')
          .leftJoin('like.user', 'user')
          .where('article.id = :articleId', { articleId: article.id })
          .orderBy('like.id', 'DESC')
          .select(['article.id', 'like.id', 'user.id', 'user.nick'])
          .getOne()
      ).likes;
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
