import { store } from '../../app/store';
import { View } from './view.model';
import { articlesApi } from './articles.api';

export const handleViewEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as View;
  store.dispatch(
    articlesApi.util.updateQueryData('selectArticleViews', id, (draft) => {
      const view = draft.find((view) => view.id === body.id);
      if (!view) {
        draft.unshift(body);
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
              article.views++;
            }
          },
        ),
      );
    });
};
