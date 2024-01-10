import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import ThingImageWithText from './ThingImageWithText';
import SingleText from './SingleText';
import PriceText from './PriceText';
import { parseThingAmount } from '../utils';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  item: number;
  description?: string;
  amount: number;
  intake: number;
  kit: number;
  price: number;
}

export const ThingsItemWithAmount = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <ThingImageWithText {...props} />
      <Group spacing={8}>
        <SingleText text={parseThingAmount(props)} />
        <PriceText price={props.price} />
      </Group>
    </div>
  ),
);
