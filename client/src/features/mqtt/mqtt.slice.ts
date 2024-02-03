import { connect } from 'mqtt/dist/mqtt.min';
import { t } from 'i18next';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { showNotification } from '@mantine/notifications';
import { store } from '../../app/store';
import { useAppSelector } from '../../app/hooks';

const audio = new Audio('/sound.mp3');

const client = connect(import.meta.env.VITE_BROKER_URL);

client.on('connect', () =>
  client.subscribe([
    import.meta.env.VITE_BROKER_TOPIC + 'users/#',
    import.meta.env.VITE_BROKER_TOPIC + 'notifications/0/#',
  ]),
);

client.on('message', (topic, message) => {
  const id = +topic.split('/')[2];
  const payload = message.toString();
  if (topic.split('/')[1] === 'users') {
    if (payload) {
      store.dispatch(addOnlineUser(id));
    } else {
      store.dispatch(removeOnlineUser(id));
      if (store.getState().auth.user?.id === id) {
        store.dispatch(publishOnline(id));
      }
    }
  } else {
    const [nick, action, page] = topic.split('/').slice(3);
    const data = `${id}/${nick}/${action}/${page}`;
    if (payload) {
      store.dispatch(addNotification([data, payload]));
      showNotification({
        title: t('notifications.notification'),
        message: nick + ' ' + t(`notifications.${page}.${action}`),
      });
      if (!store.getState().mqtt.mute) {
        audio.play();
      }
    } else {
      store.dispatch(removeNotification(data));
    }
  }
});

const initialState = {
  users: [] as number[],
  notifications: {} as { [key: string]: string },
  mute: false,
};

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    addOnlineUser: (state, action: PayloadAction<number>) => {
      !state.users.includes(action.payload) && state.users.push(action.payload);
    },
    removeOnlineUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user !== action.payload);
    },
    addNotification: (state, action: PayloadAction<[string, string]>) => {
      state.notifications[action.payload[0]] = action.payload[1];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      delete state.notifications[action.payload];
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
    publishNotification: (_, action: PayloadAction<string>) => {
      client.publish(
        import.meta.env.VITE_BROKER_TOPIC + 'notifications/' + action.payload,
        '',
        { retain: true },
      );
    },
    subscribe: (_, action: PayloadAction<number>) => {
      client.subscribe(
        import.meta.env.VITE_BROKER_TOPIC +
          'notifications/' +
          action.payload +
          '/#',
      );
    },
    unsubscribe: (_, action: PayloadAction<number>) => {
      client.unsubscribe(
        import.meta.env.VITE_BROKER_TOPIC +
          'notifications/' +
          action.payload +
          '/#',
      );
    },
  },
});

export default mqttSlice.reducer;

export const {
  addOnlineUser,
  removeOnlineUser,
  addNotification,
  removeNotification,
  toggleMute,
  publishOnline,
  publishOffline,
  publishNotification,
  subscribe,
  unsubscribe,
} = mqttSlice.actions;

export const getOnlineUsers = () => useAppSelector((state) => state.mqtt.users);

export const getActiveNotifications = () =>
  useAppSelector((state) =>
    Object.keys(state.mqtt.notifications).map((notification) => ({
      key: notification,
      id: notification.split('/')[0],
      nick: notification.split('/')[1],
      action: notification.split('/')[2],
      page: notification.split('/')[3],
      date: state.mqtt.notifications[notification],
    })),
  );

export const getMute = () => useAppSelector((state) => state.mqtt.mute);
