import { store } from '../../app/store';
import { PollComment } from './comment.model';
import { commentsApi } from './comments.api';
import { pollsApi } from './polls.api';

export const handlePollCommentEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as PollComment;
  store.dispatch(
    commentsApi.util.updateQueryData('selectPollComments', id, (draft) => {
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
  const endpoints = pollsApi.util.selectInvalidatedBy(store.getState(), [
    'Poll',
  ]);
  endpoints
    .filter((endpoint) => endpoint.endpointName === 'getMainPolls')
    .forEach((endpoint) => {
      store.dispatch(
        pollsApi.util.updateQueryData(
          'getMainPolls',
          endpoint.originalArgs,
          (draft) => {
            const poll = draft.result.find((poll) => poll.id === id);
            if (poll) {
              if (body.createdAt) {
                poll.comment = body;
                poll.comments++;
              } else if (body.text) {
                if (poll.comment?.id === body.id) {
                  poll.comment.text = body.text;
                }
              } else {
                if (poll.comment?.id === body.id) {
                  const comments =
                    commentsApi.endpoints.selectPollComments.select(id)(
                      store.getState(),
                    ).data;
                  if (comments) {
                    if (comments.length) {
                      poll.comment = comments[comments.length - 1];
                    } else {
                      poll.comment = undefined;
                    }
                  }
                }
                poll.comments--;
              }
            }
          },
        ),
      );
    });
};
