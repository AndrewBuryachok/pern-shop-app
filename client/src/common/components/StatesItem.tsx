import { forwardRef } from 'react';
import { Group } from '@mantine/core';
import SingleText from './SingleText';
import DateText from './DateText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  price: number;
  date: Date;
}

export const StatesItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <Group>
        <SingleText text={`${props.price}$`} />
        <div>
          <DateText date={props.date} />
        </div>
      </Group>
    </div>
  ),
);
