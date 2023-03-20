import { ReactNode } from 'react';
import { Indicator } from '@mantine/core';

type Props = {
  status: boolean;
  children: ReactNode;
};

export default function CustomIndicator(props: Props) {
  return (
    <Indicator zIndex={1} size={8} color={props.status ? 'green' : 'red'}>
      {props.children}
    </Indicator>
  );
}
