import { store } from '../../app/store';
import { Comment } from './comment.model';
import { commentsApi } from './comments.api';
import { articlesApi } from './articles.api';

export const handleCommentEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as Comment;
  store.dispatch(
    commentsApi.util.updateQueryData('selectArticleComments', id, (draft) => {
      const comment = draft.find((comment) => comment.id === body.id);
      if (!comment) {
        if (body.createdAt) {
          draft.push(body);
        }
      } else if (body.text) {
        comment.text = body.text;
      } else {
        return draft.filter((comment) => comment.id !== body.id);
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
                article.comment = body;
                article.comments++;
              } else if (body.text) {
                if (article.comment?.id === body.id) {
                  article.comment.text = body.text;
                }
              } else {
                if (article.comment?.id === body.id) {
                  const comments =
                    commentsApi.endpoints.selectArticleComments.select(id)(
                      store.getState(),
                    ).data;
                  if (comments) {
                    if (comments.length) {
                      article.comment = comments[comments.length - 1];
                    } else {
                      article.comment = undefined;
                    }
                  }
                }
                article.comments--;
              }
            }
          },
        ),
      );
    });
};
