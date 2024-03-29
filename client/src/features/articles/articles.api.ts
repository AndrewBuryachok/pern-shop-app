import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Article } from './article.model';
import {
  CreateArticleDto,
  DeleteArticleDto,
  EditArticleDto,
  LikeArticleDto,
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
    createArticle: build.mutation<void, CreateArticleDto>({
      query: (dto) => ({
        url: '/articles',
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
      invalidatesTags: ['Article', 'Like'],
    }),
    likeArticle: build.mutation<void, LikeArticleDto>({
      query: ({ articleId }) => ({
        url: `/articles/${articleId}/likes`,
        method: 'POST',
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
  useCreateArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useLikeArticleMutation,
} = articlesApi;
