import { Avatar } from '@mantine/core';
import CustomIndicator from './CustomIndicator';

type Props = {
  name: string;
  status: boolean;
};

export default function CustomAvatar(props: Props) {
  return (
    <CustomIndicator status={props.status}>
      <Avatar
        size={32}
        src={`https://minotar.net/avatar/${props.name}/32.png`}
        alt={props.name}
      />
    </CustomIndicator>
  );
}
