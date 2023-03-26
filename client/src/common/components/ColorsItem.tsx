import { forwardRef } from 'react';
import SingleText from './SingleText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  text: string;
  color: string;
}

export const ColorsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <SingleText {...props} color={+props.color} />
    </div>
  ),
);
