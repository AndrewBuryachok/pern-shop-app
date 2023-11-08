import { forwardRef } from 'react';
import CustomAvatarWithText from './CustomAvatarWithText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  userid: number;
  username: string;
}

export const UsersItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <CustomAvatarWithText id={props.userid} name={props.username} />
    </div>
  ),
);
