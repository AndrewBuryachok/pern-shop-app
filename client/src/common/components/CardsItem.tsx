import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  user?: string;
  status?: number;
  name: string;
  color: string;
  balance?: number;
}

export const CardsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      {props.user ? (
        <Group spacing={8}>
          <CustomAvatar name={props.user} status={!!props.status} />
          <div>
            <SingleText text={props.user} />
            <Group spacing={8}>
              <SingleText text={props.name} color={+props.color} />
              {props.balance !== undefined && (
                <SingleText text={`${props.balance}$`} />
              )}
            </Group>
          </div>
        </Group>
      ) : (
        <SingleText text={props.name} color={+props.color} />
      )}
    </div>
  ),
);
