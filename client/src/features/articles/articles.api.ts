import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Article, SmArticle } from './article.model';
import { ArticleView } from './article-view.model';
import { ArticleLike } from './article-like.model';
import {
  CreateArticleDto,
  DeleteArticleDto,
  EditArticleDto,
  ExtCreateArticleDto,
  ExtLikeArticleDto,
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
    getSubscribedArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/subscribed?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'Subscriber'],
    }),
    getLikedArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/liked?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'ArticleLike'],
    }),
    getCommentedArticles: build.query<IResponse<Article>, IRequest>({
      query: (req) => ({
        url: `/articles/commented?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Article', 'ArticleComment'],
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
      providesTags: ['Auth', 'ArticleView'],
    }),
    selectLikedArticles: build.query<SmArticle[], void>({
      query: () => ({
        url: '/articles/liked/select',
      }),
      providesTags: ['Auth', 'ArticleLike'],
    }),
    selectArticleViews: build.query<ArticleView[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/views`,
      }),
      providesTags: ['ArticleView'],
    }),
    selectArticleUpLikes: build.query<ArticleLike[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/likes/up`,
      }),
      providesTags: ['ArticleLike'],
    }),
    selectArticleDownLikes: build.query<ArticleLike[], number>({
      query: (articleId) => ({
        url: `/articles/${articleId}/likes/down`,
      }),
      providesTags: ['ArticleLike'],
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
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = articlesApi.util.selectInvalidatedBy(getState(), [
          'Article',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainArticles')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              articlesApi.util.updateQueryData(
                'getMainArticles',
                endpoint.originalArgs,
                (draft) => {
                  const article = draft.result.find(
                    (article) => article.id === dto.articleId,
                  );
                  if (article) {
                    article.views++;
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
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
    likeArticle: build.mutation<void, ExtLikeArticleDto>({
      query: ({ articleId, upLiked, downLiked, ...dto }) => ({
        url: `/articles/${articleId}/likes`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['ArticleLike'],
      onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const endpoints = articlesApi.util.selectInvalidatedBy(getState(), [
          'Article',
        ]);
        endpoints
          .filter((endpoint) => endpoint.endpointName === 'getMainArticles')
          .forEach((endpoint) => {
            const patchResult = dispatch(
              articlesApi.util.updateQueryData(
                'getMainArticles',
                endpoint.originalArgs,
                (draft) => {
                  const article = draft.result.find(
                    (article) => article.id === dto.articleId,
                  );
                  if (article) {
                    if (dto.upLiked || dto.downLiked) {
                      if (dto.upLiked === dto.type) {
                        if (dto.type) {
                          article.upLikes--;
                        } else {
                          article.downLikes--;
                        }
                      } else {
                        if (dto.type) {
                          article.upLikes++;
                          article.downLikes--;
                        } else {
                          article.downLikes++;
                          article.upLikes--;
                        }
                      }
                    } else {
                      if (dto.type) {
                        article.upLikes++;
                      } else {
                        article.downLikes++;
                      }
                    }
                  }
                },
              ),
            );
            queryFulfilled.catch(patchResult.undo);
          });
        const patchResult = dispatch(
          articlesApi.util.updateQueryData(
            'selectLikedArticles',
            undefined,
            (draft) => {
              if (dto.upLiked || dto.downLiked) {
                if (dto.upLiked === dto.type) {
                  draft = draft.filter(
                    (article) => article.id === dto.articleId,
                  );
                } else {
                  draft.find(
                    (article) => article.id === dto.articleId,
                  )!.like.type = dto.type;
                }
              } else {
                draft.push({
                  id: dto.articleId,
                  like: { id: 0, type: dto.type },
                });
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
  useGetSubscribedArticlesQuery,
  useGetLikedArticlesQuery,
  useGetCommentedArticlesQuery,
  useGetAllArticlesQuery,
  useSelectViewedArticlesQuery,
  useSelectLikedArticlesQuery,
  useSelectArticleViewsQuery,
  useSelectArticleUpLikesQuery,
  useSelectArticleDownLikesQuery,
  useCreateMyArticleMutation,
  useCreateUserArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useViewArticleMutation,
  useLikeArticleMutation,
} = articlesApi;
