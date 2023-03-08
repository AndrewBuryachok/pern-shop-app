import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import ThingImage from './ThingImage';
import SingleText from './SingleText';
import { items } from '../constants';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  item: number;
}

export const ThingsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group spacing={8}>
        <ThingImage item={props.item} />
        <SingleText text={items[props.item - 1].substring(3)} />
      </Group>
    </div>
  ),
);
