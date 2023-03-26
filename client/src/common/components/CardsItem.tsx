import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import SingleText from './SingleText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
  color: string;
  balance?: number;
}

export const CardsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group spacing={8}>
        <SingleText text={props.name} color={+props.color} />
        {props.balance !== undefined && (
          <SingleText text={`${props.balance}$`} />
        )}
      </Group>
    </div>
  ),
);
