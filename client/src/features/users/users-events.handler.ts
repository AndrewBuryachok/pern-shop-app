import { store } from '../../app/store';
import { authSlice } from '../auth/auth.slice';
import { SmUser } from './user.model';
import { usersApi } from './users.api';

export const handleUserEvent = (json: string) => {
  const body = JSON.parse(json) as SmUser;
  store.dispatch(
    usersApi.util.updateQueryData('selectAllUsers', undefined, (draft) => {
      const user = draft.find((user) => user.id === body.id);
      if (!user) {
        draft.splice(store.getState().mqtt.users.length, 0, body);
      } else {
        user.nick = body.nick;
        user.avatar = body.avatar;
      }
    }),
  );
  const user = store.getState().auth.user;
  if (user?.id === body.id) {
    store.dispatch(authSlice.actions.addCurrentUser({ ...user, ...body }));
  }
};
