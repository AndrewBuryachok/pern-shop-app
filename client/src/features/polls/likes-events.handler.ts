import { store } from '../../app/store';
import { PollLike } from './poll-like.model';
import { pollsApi } from './polls.api';

export const handlePollLikeEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as PollLike & { toggle: boolean };
  store.dispatch(
    pollsApi.util.updateQueryData('selectPollLikes', id, (draft) => {
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
                if (body.type) {
                  poll.upLikes++;
                } else {
                  poll.downLikes++;
                }
              } else if (body.toggle) {
                if (body.type) {
                  poll.upLikes++;
                  poll.downLikes--;
                } else {
                  poll.upLikes--;
                  poll.downLikes++;
                }
              } else {
                if (body.type) {
                  poll.upLikes--;
                } else {
                  poll.downLikes--;
                }
              }
            }
          },
        ),
      );
    });
};
