import { forwardRef } from 'react';
import { Avatar, Group } from '@mantine/core';
import SingleText from './SingleText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
}

export const UsersItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group spacing={8}>
        <Avatar
          size={32}
          src={`https://minotar.net/avatar/${props.name}/32.png`}
          alt={props.name}
        />
        <SingleText text={props.name} />
      </Group>
    </div>
  ),
);
