import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Article, SmArticle } from './article.model';
import { ArticleView } from './article-view.model';
import { Like } from './like.model';
import { Comment } from '../comments/comment.model';
import {
  CreateArticleDto,
  DeleteArticleDto,
  EditArticleDto,
  ExtCreateArticleDto,
  LikeArticleDto,
  ViewArticleDto,
} from './article.dto';
import { getQuery } from '../../common/utils';

export const articlesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles?${getQuery(req)}`,
      }),
      providesTags: ['Article', 'Like', 'Comment'],
    }),
    getMyArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'Like', 'Comment'],
    }),
    getSubscribedArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/subscribed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'Like', 'Comment', 'Subscriber'],
    }),
    getLikedArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/liked?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'Like', 'Comment'],
    }),
    getCommentedArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/commented?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'Like', 'Comment'],
    }),
    getAllArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'Like', 'Comment'],
    }),
    selectViewedArticles: build.query<number[], void>({
      query: () => ({
        url: '/articles/viewed/select',
      }),
      providesTags: ['Auth', 'ArticleView'],
    }),
    selectLikedArticles: build.query<SmArticle[], void>({
      query: () => ({
        url: '/articles/liked/select',
      }),
      providesTags: ['Auth', 'Like'],
    }),
    selectArticleViews: build.query<ArticleView[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/views`,
      }),
      providesTags: ['ArticleView'],
    }),
    selectArticleLikes: build.query<Like[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/likes`,
      }),
      providesTags: ['Like'],
    }),
    selectArticleComments: build.query<Comment[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/comments`,
      }),
      providesTags: ['Comment'],
    }),
    createMyArticle: build.mutation<void, CreateArticleDto>({
      query: (dto) => ({
        url: '/articles',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Article'],
    }),
    createUserArticle: build.mutation<void, ExtCreateArticleDto>({
      query: (dto) => ({
        url: '/articles/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Article'],
    }),
    editArticle: build.mutation<void, EditArticleDto>({
      query: ({ articleId, ...dto }) => ({
        url: `/articles/${articleId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Article'],
    }),
    deleteArticle: build.mutation<void, DeleteArticleDto>({
      query: ({ articleId }) => ({
        url: `/articles/${articleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),
    viewArticle: build.mutation<void, ViewArticleDto>({
      query: ({ articleId }) => ({
        url: `/articles/${articleId}/views`,
        method: 'POST',
      }),
      invalidatesTags: ['ArticleView'],
    }),
    likeArticle: build.mutation<void, LikeArticleDto>({
      query: ({ articleId, ...dto }) => ({
        url: `/articles/${articleId}/likes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Like'],
    }),
  }),
});

export const {
  useGetMainArticlesQuery,
  useGetMyArticlesQuery,
  useGetSubscribedArticlesQuery,
  useGetLikedArticlesQuery,
  useGetCommentedArticlesQuery,
  useGetAllArticlesQuery,
  useSelectViewedArticlesQuery,
  useSelectLikedArticlesQuery,
  useSelectArticleViewsQuery,
  useSelectArticleLikesQuery,
  useSelectArticleCommentsQuery,
  useCreateMyArticleMutation,
  useCreateUserArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useViewArticleMutation,
  useLikeArticleMutation,
} = articlesApi;
