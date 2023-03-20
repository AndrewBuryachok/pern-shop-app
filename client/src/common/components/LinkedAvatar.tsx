import { Link } from 'react-router-dom';
import { Avatar } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';

type Props = SmUser;

export default function LinkedAvatar(props: Props) {
  return (
    <CustomIndicator status={props.status}>
      <Avatar
        component={Link}
        to={`/users/${props.id}`}
        size={32}
        src={`https://minotar.net/avatar/${props.name}/32.png`}
        alt={props.name}
      />
    </CustomIndicator>
  );
}
