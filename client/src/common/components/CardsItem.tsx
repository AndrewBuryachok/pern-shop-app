import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  userid: number;
  nick: string;
  avatar: string;
  name: string;
  color: string;
  balance?: number;
}

export const CardsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group spacing={8}>
        <CustomAvatar
          id={props.userid}
          nick={props.nick}
          avatar={props.avatar}
        />
        <div>
          <SingleText text={props.nick} />
          <Group spacing={8}>
            <SingleText text={props.name} color={+props.color} />
            {props.balance !== undefined && (
              <SingleText text={`${props.balance}$`} />
            )}
          </Group>
        </div>
      </Group>
    </div>
  ),
);
