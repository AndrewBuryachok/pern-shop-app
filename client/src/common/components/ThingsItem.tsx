import { forwardRef } from 'react';
import ThingImageWithText from './ThingImageWithText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  item: number;
  description?: string;
}

export const ThingsItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <ThingImageWithText {...props} />
    </div>
  ),
);
