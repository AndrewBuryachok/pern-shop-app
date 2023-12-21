import { Group } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import LinkedAvatar from './LinkedAvatar';
import DoubleText from './DoubleText';
import { parseDate } from '../utils';

type Props = {
  user: SmUser;
  createdAt: Date;
};

export default function AvatarWithDateText(props: Props) {
  const createdAt = parseDate(props.createdAt);

  return (
    <Group spacing={8}>
      <LinkedAvatar {...props.user} />
      <div>
        <DoubleText
          text={props.user.nick}
          subtext={
            new Date().toDateString() ===
            new Date(props.createdAt).toDateString()
              ? createdAt.time
              : createdAt.date
          }
        />
      </div>
    </Group>
  );
}
