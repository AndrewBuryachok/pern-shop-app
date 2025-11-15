import { connect } from 'mqtt/dist/mqtt.min';
import { t } from 'i18next';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { showNotificationWithAvatar } from '../../common/components/CustomNotification';
import { AppDispatch, RootState, store } from '../../app/store';
import { useAppSelector } from '../../app/hooks';
import { handleEvent } from './events.handler';
import { INotification } from '../../common/interfaces';
import { Event } from '../../common/enums';
import { usersApi } from '../users/users.api';

const audio = new Audio('/sound.mp3');

const client = connect(import.meta.env.VITE_BROKER_URL);

client.on('connect', () =>
  client.subscribe([
    import.meta.env.VITE_BROKER_TOPIC + 'streamers/#',
    import.meta.env.VITE_BROKER_TOPIC + 'users/#',
    import.meta.env.VITE_BROKER_TOPIC + 'notifications/0/#',
    import.meta.env.VITE_BROKER_TOPIC + 'events/0/#',
  ]),
);

client.on('message', (topic, message, packet) => {
  const userId = +topic.split('/')[2];
  const payload = message.toString();
  switch (topic.split('/')[1]) {
    case 'streamers':
      if (payload) {
        store.dispatch(addStreamer([userId, payload]));
      } else {
        store.dispatch(removeStreamer(userId));
      }
      break;
    case 'users':
      if (payload) {
        store.dispatch(addUser(userId));
        if (!packet.retain) {
          store.dispatch(
            usersApi.util.updateQueryData(
              'selectAllUsers',
              undefined,
              (draft) => {
                draft.sort((a, b) =>
                  a.id === userId ? -1 : b.id === userId ? 1 : 0,
                );
              },
            ),
          );
        }
      } else {
        store.dispatch(removeUser(userId));
        const users = store.getState().mqtt.users;
        store.dispatch(
          usersApi.util.updateQueryData(
            'selectAllUsers',
            undefined,
            (draft) => {
              draft.sort((a, b) =>
                [a.id, b.id].every((id) => users.includes(id))
                  ? 0
                  : users.includes(a.id)
                  ? -1
                  : users.includes(b.id)
                  ? 1
                  : 0,
              );
            },
          ),
        );
        if (store.getState().auth.user?.id === userId) {
          store.dispatch(publishOnline(userId));
        }
      }
      break;
    case 'notifications':
      const notification = topic.split('/').slice(2).join('/');
      if (payload) {
        store.dispatch(addNotification([notification, payload]));
        if (!packet.retain) {
          const page = topic.split('/')[3];
          const action = topic.split('/')[5];
          const fromUserId = +topic.split('/')[6];
          const user = usersApi.endpoints.selectAllUsers
            .select(undefined)(store.getState())
            .data?.find((user) => user.id === fromUserId);
          showNotificationWithAvatar({
            id: notification,
            title: user?.nick || t('notifications.title'),
            message: t(`notifications.${page}.${action}`),
            user,
          });
          if (!store.getState().mqtt.mute) {
            audio.play();
          }
        }
      } else {
        store.dispatch(removeNotification(notification));
      }
      break;
    case 'unnotifications':
      const unnotification = topic.split('/').slice(3).join('/');
      if (payload) {
        store.dispatch(addUnnotification([unnotification, payload]));
      } else {
        store.dispatch(removeUnnotification(unnotification));
      }
      break;
    case 'events':
      handleEvent(topic.split('/')[3] as Event, +topic.split('/')[4], payload);
      break;
    default:
      break;
  }
});

const initialState = {
  streamers: {} as { [key: number]: string },
  users: [] as number[],
  notifications: {} as { [key: string]: string },
  unnotifications: {} as { [key: string]: string },
  mute: false,
};

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    addStreamer: (state, action: PayloadAction<[number, string]>) => {
      state.streamers[action.payload[0]] = action.payload[1];
    },
    removeStreamer: (state, action: PayloadAction<number>) => {
      delete state.streamers[action.payload];
    },
    addUser: (state, action: PayloadAction<number>) => {
      !state.users.includes(action.payload) && state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user !== action.payload);
    },
    addNotification: (state, action: PayloadAction<[string, string]>) => {
      state.notifications[action.payload[0]] = action.payload[1];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      delete state.notifications[action.payload];
    },
    addUnnotification: (state, action: PayloadAction<[string, string]>) => {
      state.unnotifications[action.payload[0]] = action.payload[1];
    },
    removeUnnotification: (state, action: PayloadAction<string>) => {
      delete state.unnotifications[action.payload];
    },
    toggleMute: (state) => {
      if (state.mute) {
        localStorage.removeItem('mute');
      } else {
        localStorage.setItem('mute', 'ON');
      }
      state.mute = !state.mute;
    },
    publishOnline: (_, action: PayloadAction<number>) => {
      client.publish(
        import.meta.env.VITE_BROKER_TOPIC + 'users/' + action.payload,
        new Date().toISOString(),
        { retain: true },
      );
    },
    publishOffline: (_, action: PayloadAction<number>) => {
      client.publish(
        import.meta.env.VITE_BROKER_TOPIC + 'users/' + action.payload,
        '',
        { retain: true },
      );
    },
    publishNotification: (state, action: PayloadAction<[string, number]>) => {
      const [notification, myId] = action.payload;
      const userId = +notification.split('/')[0];
      if (userId) {
        client.publish(
          import.meta.env.VITE_BROKER_TOPIC + 'notifications/' + notification,
          '',
          { retain: true },
        );
      } else if (myId) {
        client.publish(
          import.meta.env.VITE_BROKER_TOPIC +
            'unnotifications/' +
            myId +
            notification.slice(1),
          state.notifications[notification],
          { retain: true },
        );
      } else {
        delete state.notifications[notification];
      }
    },
    subscribe: (_, action: PayloadAction<number>) => {
      client.subscribe([
        import.meta.env.VITE_BROKER_TOPIC +
          'notifications/' +
          action.payload +
          '/#',
        import.meta.env.VITE_BROKER_TOPIC +
          'unnotifications/' +
          action.payload +
          '/#',
        import.meta.env.VITE_BROKER_TOPIC + 'events/' + action.payload + '/#',
      ]);
    },
    unsubscribe: (state, action: PayloadAction<number>) => {
      state.notifications = Object.fromEntries(
        Object.entries(state.notifications).filter(
          ([notification]) => !+notification.split('/')[0],
        ),
      );
      state.unnotifications = {};
      client.unsubscribe([
        import.meta.env.VITE_BROKER_TOPIC +
          'notifications/' +
          action.payload +
          '/#',
        import.meta.env.VITE_BROKER_TOPIC +
          'unnotifications/' +
          action.payload +
          '/#',
        import.meta.env.VITE_BROKER_TOPIC + 'events/' + action.payload + '/#',
      ]);
    },
  },
});

export default mqttSlice.reducer;

export const {
  addStreamer,
  removeStreamer,
  addUser,
  removeUser,
  addNotification,
  removeNotification,
  addUnnotification,
  removeUnnotification,
  toggleMute,
  publishOnline,
  publishOffline,
  publishNotification,
  subscribe,
  unsubscribe,
} = mqttSlice.actions;

export const publishNotificationWithUser =
  (notification: string) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    dispatch(
      publishNotification([notification, getState().auth.user?.id || 0]),
    );

export const getOnlineStreamers = () =>
  useAppSelector((state) => state.mqtt.streamers);

export const getOnlineUsers = () => useAppSelector((state) => state.mqtt.users);

export const getActiveNotifications = (): INotification[] =>
  useAppSelector((state) =>
    Object.entries(state.mqtt.notifications)
      .filter(
        ([notification]) =>
          !state.mqtt.unnotifications[
            notification.split('/').slice(1).join('/')
          ],
      )
      .map(([notification, date]) => ({
        key: notification,
        toUserId: +notification.split('/')[0],
        page: notification.split('/')[1],
        id: +notification.split('/')[2],
        action: notification.split('/')[3],
        fromUserId: +notification.split('/')[4],
        date: new Date(date),
        user: usersApi.endpoints.selectAllUsers
          .select(undefined)(store.getState())
          .data?.find((user) => user.id === +notification.split('/')[4]),
      })),
  );

export const getMute = () => useAppSelector((state) => state.mqtt.mute);
