import { connect } from 'mqtt/dist/mqtt.min';
import { t } from 'i18next';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { showNotification } from '@mantine/notifications';
import { store } from '../../app/store';
import { useAppSelector } from '../../app/hooks';
import { Tokens } from '../auth/auth.model';

const audio = new Audio('/sound.mp3');

const client = connect(import.meta.env.VITE_BROKER_URL);

client.on('connect', () =>
  client.subscribe(import.meta.env.VITE_BROKER_TOPIC + 'users/#'),
);

client.on('message', (topic, message) => {
  if (topic.split('/')[1] === 'users') {
    const user = +topic.split('/')[2];
    if (message.toString()) {
      store.dispatch(addOnlineUser(user));
    } else {
      store.dispatch(removeOnlineUser(user));
    }
  } else {
    const [action, modal] = message.toString().toLowerCase().split(' ');
    store.dispatch(addNotification(modal));
    showNotification({
      title: t('notifications.notification'),
      message:
        t('actions.' + action) + ' ' + t('modals.' + modal).toLowerCase(),
      autoClose: false,
      onClose: () => store.dispatch(removeNotification(modal)),
    });
    audio.play();
  }
});

const user = localStorage.getItem('user');

if (user) {
  client.subscribe(
    import.meta.env.VITE_BROKER_TOPIC +
      'notifications/' +
      (JSON.parse(user) as Tokens).id,
  );
}

const initialState = {
  users: [] as number[],
  notifications: {} as { [key: string]: number },
};

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    addOnlineUser: (state, action: PayloadAction<number>) => {
      state.users.push(action.payload);
    },
    removeOnlineUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user !== action.payload);
    },
    addNotification: (state, action: PayloadAction<string>) => {
      state.notifications[action.payload] =
        (state.notifications[action.payload] || 0) + 1;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications[action.payload] =
        state.notifications[action.payload] - 1;
    },
    subscribe: (_, action: PayloadAction<number>) => {
      client.subscribe(
        import.meta.env.VITE_BROKER_TOPIC + 'notifications/' + action.payload,
      );
    },
    unsubscribe: (_, action: PayloadAction<number>) => {
      client.unsubscribe(
        import.meta.env.VITE_BROKER_TOPIC + 'notifications/' + action.payload,
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
  subscribe,
  unsubscribe,
} = mqttSlice.actions;

export const getOnlineUsers = () => useAppSelector((state) => state.mqtt.users);

export const getActiveNotifications = () =>
  useAppSelector((state) => state.mqtt.notifications);
