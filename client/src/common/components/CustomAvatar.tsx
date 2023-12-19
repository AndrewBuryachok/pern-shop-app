import { Avatar } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';

type Props = SmUser;

export default function CustomAvatar(props: Props) {
  return (
    <CustomIndicator {...props}>
      <Avatar
        size={32}
        src={`${import.meta.env.VITE_AVATAR_URL}${
          import.meta.env.VITE_HEAD_ROUTE
        }${props.name}`}
        alt={props.name}
      >
        {props.name.toUpperCase().slice(0, 2)}
      </Avatar>
    </CustomIndicator>
  );
}
