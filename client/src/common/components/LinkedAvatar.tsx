import { Link } from 'react-router-dom';
import { Avatar } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';

type Props = SmUser;

export default function LinkedAvatar(props: Props) {
  return (
    <CustomIndicator {...props}>
      <Avatar
        component={Link}
        to={`/users/${props.id}`}
        size={32}
        src={`${import.meta.env.VITE_AVATAR_URL}${
          import.meta.env.VITE_HEAD_ROUTE
        }${props.name}`}
        alt={props.name}
      />
    </CustomIndicator>
  );
}
