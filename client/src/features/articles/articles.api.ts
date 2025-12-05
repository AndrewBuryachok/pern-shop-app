import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Article } from './article.model';
import { View } from './view.model';
import { Like } from './like.model';
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
      providesTags: ['Article'],
    }),
    getMyArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article'],
    }),
    getAllArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article'],
    }),
    selectViewedArticles: build.query<number[], void>({
      query: () => ({
        url: '/articles/viewed/select',
      }),
      providesTags: ['Auth'],
    }),
    selectLikedArticles: build.query<{ up: number[]; down: number[] }, void>({
      query: () => ({
        url: '/articles/liked/select',
      }),
      providesTags: ['Auth'],
    }),
    selectArticleViews: build.query<View[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/views`,
      }),
    }),
    selectArticleLikes: build.query<Like[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/likes`,
      }),
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
      invalidatesTags: ['View'],
      onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          articlesApi.util.updateQueryData(
            'selectViewedArticles',
            undefined,
            (draft) => {
              draft.push(dto.articleId);
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    likeArticle: build.mutation<void, LikeArticleDto>({
      query: ({ articleId, ...dto }) => ({
        url: `/articles/${articleId}/likes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Like'],
      onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          articlesApi.util.updateQueryData(
            'selectLikedArticles',
            undefined,
            (draft) => {
              if (dto.type) {
                draft.down = draft.down.filter((id) => id !== dto.articleId);
                if (draft.up.includes(dto.articleId)) {
                  draft.up = draft.up.filter((id) => id !== dto.articleId);
                } else {
                  draft.up.push(dto.articleId);
                }
              } else {
                draft.up = draft.up.filter((id) => id !== dto.articleId);
                if (draft.down.includes(dto.articleId)) {
                  draft.down = draft.down.filter((id) => id !== dto.articleId);
                } else {
                  draft.down.push(dto.articleId);
                }
              }
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
  }),
});

export const {
  useGetMainArticlesQuery,
  useGetMyArticlesQuery,
  useGetAllArticlesQuery,
  useSelectViewedArticlesQuery,
  useSelectLikedArticlesQuery,
  useSelectArticleViewsQuery,
  useSelectArticleLikesQuery,
  useCreateMyArticleMutation,
  useCreateUserArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useViewArticleMutation,
  useLikeArticleMutation,
} = articlesApi;
