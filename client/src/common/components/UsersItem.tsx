import { forwardRef } from 'react';
import CustomAvatarWithText from './CustomAvatarWithText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
}

export const UsersItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <CustomAvatarWithText {...props} />
    </div>
  ),
);
