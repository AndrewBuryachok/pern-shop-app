import { store } from '../../app/store';
import { Message } from './message.model';
import { messagesApi } from './messages.api';

export const handleMessageEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as Message;
  store.dispatch(
    messagesApi.util.updateQueryData('selectUserMessages', id, (draft) => {
      const message = draft.find((message) => message.id === body.id);
      if (!message) {
        if (body.createdAt) {
          draft.push(body);
        }
      } else if (body.text) {
        message.text = body.text;
      } else {
        return draft.filter((message) => message.id !== body.id);
      }
    }),
  );
  store.dispatch(
    messagesApi.util.updateQueryData('selectMyMessages', undefined, (draft) => {
      if (body.createdAt) {
        const message = draft.find((message) => message.user.id === id);
        if (!message) {
          draft.unshift(body);
        } else {
          message.id = body.id;
          message.text = body.text;
          draft.sort((a, b) => b.id - a.id);
        }
      } else {
        const message = draft.find((message) => message.id === body.id);
        if (message) {
          if (body.text) {
            message.text = body.text;
          } else {
            const messages = messagesApi.endpoints.selectUserMessages.select(
              id,
            )(store.getState()).data;
            if (messages) {
              if (messages.length) {
                const last = messages[messages.length - 1];
                message.id = last.id;
                message.text = last.text;
                draft.sort((a, b) => b.id - a.id);
              } else {
                return draft.filter((message) => message.id !== body.id);
              }
            }
          }
        }
      }
    }),
  );
};
