import { forwardRef } from 'react';
import PriorityIconWithText from './PriorityIconWithText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  priority: number;
}

export const PrioritiesItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <PriorityIconWithText {...props} />
    </div>
  ),
);
