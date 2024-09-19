import { store } from '../../app/store';
import { ArticleLike } from './article-like.model';
import { articlesApi } from './articles.api';

export const handleArticleLikeEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as ArticleLike & { toggle: boolean };
  store.dispatch(
    articlesApi.util.updateQueryData('selectArticleLikes', id, (draft) => {
      const like = draft.find((like) => like.id === body.id);
      if (!like) {
        if (body.createdAt) {
          draft.unshift(body);
        }
      } else if (body.toggle) {
        like.type = !like.type;
      } else {
        return draft.filter((like) => like.id !== body.id);
      }
    }),
  );
  const endpoints = articlesApi.util.selectInvalidatedBy(store.getState(), [
    'Article',
  ]);
  endpoints
    .filter((endpoint) => endpoint.endpointName === 'getMainArticles')
    .forEach((endpoint) => {
      store.dispatch(
        articlesApi.util.updateQueryData(
          'getMainArticles',
          endpoint.originalArgs,
          (draft) => {
            const article = draft.result.find((article) => article.id === id);
            if (article) {
              if (body.createdAt) {
                if (body.type) {
                  article.upLikes++;
                } else {
                  article.downLikes++;
                }
              } else if (body.toggle) {
                if (body.type) {
                  article.upLikes++;
                  article.downLikes--;
                } else {
                  article.upLikes--;
                  article.downLikes++;
                }
              } else {
                if (body.type) {
                  article.upLikes--;
                } else {
                  article.downLikes--;
                }
              }
            }
          },
        ),
      );
    });
};
