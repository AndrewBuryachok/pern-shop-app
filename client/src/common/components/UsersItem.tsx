import { forwardRef } from 'react';
import CustomAvatarWithText from './CustomAvatarWithText';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  userid: number;
  nick: string;
  avatar: string;
}

export const UsersItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <CustomAvatarWithText
        id={props.userid}
        nick={props.nick}
        avatar={props.avatar}
      />
    </div>
  ),
);
