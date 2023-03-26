import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import PlaceText from './PlaceText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
  x: number;
  y: number;
  price?: number;
  container?: number;
}

export const PlacesItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group spacing={8}>
        <div>
          <PlaceText {...props} />
        </div>
      </Group>
    </div>
  ),
);
