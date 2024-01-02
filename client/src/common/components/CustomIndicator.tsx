import { ReactNode } from 'react';
import { Indicator } from '@mantine/core';
import { getOnlineUsers } from '../../features/mqtt/mqtt.slice';

type Props = {
  id: number;
  children: ReactNode;
};

export default function CustomIndicator(props: Props) {
  const users = getOnlineUsers();

  const status = users.includes(props.id);

  return (
    <Indicator zIndex={1} size={8} color={status ? 'green' : 'red'}>
      {props.children}
    </Indicator>
  );
}
