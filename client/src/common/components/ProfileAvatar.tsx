import { Avatar, Stack } from '@mantine/core';
import { ExtUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';
import { backgrounds } from '../constants';

type Props = ExtUser;

export default function ProfileAvatar(props: Props) {
  return (
    <Stack spacing={0} align='center'>
      <CustomIndicator {...props}>
        <Avatar
          px={8}
          pt={16}
          bg={`url(https://minecraft.wiki/images/${
            backgrounds[props.background - 1]
          }.png)`}
          style={{ backgroundPosition: 'center', backgroundSize: 496 }}
          radius='md'
          size={248}
          src={`${import.meta.env.VITE_AVATAR_URL}${
            import.meta.env.VITE_BUST_ROUTE
          }${props.avatar || props.nick}`}
          alt={props.nick}
        >
          {props.nick.toUpperCase().slice(0, 2)}
        </Avatar>
      </CustomIndicator>
    </Stack>
  );
}
