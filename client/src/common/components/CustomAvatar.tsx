import { Link } from 'react-router-dom';
import { Avatar } from '@mantine/core';

type Props = {
  id: number;
  name: string;
};

export default function CustomAvatar(props: Props) {
  return (
    <Avatar
      component={Link}
      to={`/users/${props.id}`}
      size={32}
      src={`https://minotar.net/avatar/${props.name}/32.png`}
      alt={props.name}
    />
  );
}
