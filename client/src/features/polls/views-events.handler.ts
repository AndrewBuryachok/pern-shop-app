import { store } from '../../app/store';
import { PollView } from './poll-view.model';
import { pollsApi } from './polls.api';

export const handlePollViewEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as PollView;
  store.dispatch(
    pollsApi.util.updateQueryData('selectPollViews', id, (draft) => {
      const view = draft.find((view) => view.id === body.id);
      if (!view) {
        draft.unshift(body);
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
              poll.views++;
            }
          },
        ),
      );
    });
};
