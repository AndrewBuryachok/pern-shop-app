import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import PriceText from './PriceText';
import DateText from './DateText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  price: number;
  date: Date;
}

export const StatesItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group>
        <PriceText price={props.price} />
        <div>
          <DateText date={props.date} />
        </div>
      </Group>
    </div>
  ),
);
