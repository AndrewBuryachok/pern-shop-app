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
        src={`${import.meta.env.VITE_AVATAR_URL}${
          import.meta.env.VITE_HEAD_ROUTE
        }${props.name}`}
        alt={props.name}
      />
    </CustomIndicator>
  );
}
