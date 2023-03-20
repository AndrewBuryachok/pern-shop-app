import { Avatar } from '@mantine/core';

type Props = {
  name: string;
};

export default function CustomAvatar(props: Props) {
  return (
    <Avatar
      size={32}
      src={`https://minotar.net/avatar/${props.name}/32.png`}
      alt={props.name}
    />
  );
}
