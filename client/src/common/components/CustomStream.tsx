import { Avatar, Group } from '@mantine/core';
import { TwitchUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';
import SingleText from './SingleText';

type Props = TwitchUser;

export default function CustomStream(props: Props) {
  return (
    <Group spacing={8}>
      <CustomIndicator {...props}>
        <Avatar
          component='a'
          href={`https://twitch.tv/${props.twitch}`}
          target='_blank'
          size={32}
          src={`${import.meta.env.VITE_AVATAR_URL}${
            import.meta.env.VITE_HEAD_ROUTE
          }${props.avatar || props.nick}`}
          alt={props.nick}
        >
          {props.nick.toUpperCase().slice(0, 2)}
        </Avatar>
      </CustomIndicator>
      <SingleText text={props.nick} bold />
    </Group>
  );
}
