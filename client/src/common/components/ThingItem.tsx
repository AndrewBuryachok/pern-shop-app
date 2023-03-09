import { forwardRef } from 'react';
import ThingImage from './ThingImage';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  item: number;
  description?: string;
}

export const ThingsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <ThingImage {...props} />
    </div>
  ),
);
