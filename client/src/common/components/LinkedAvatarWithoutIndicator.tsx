import { Link } from 'react-router-dom';
import { Avatar } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';

type Props = SmUser;

export default function LinkedAvatarWithoutIndicator(props: Props) {
  return (
    <Avatar
      component={Link}
      to={`/users/${props.nick}`}
      size={32}
      src={`${import.meta.env.VITE_AVATAR_URL}${
        import.meta.env.VITE_HEAD_ROUTE
      }${props.avatar || props.nick}`}
      alt={props.nick}
    >
      {props.nick.toUpperCase().slice(0, 2)}
    </Avatar>
  );
}
