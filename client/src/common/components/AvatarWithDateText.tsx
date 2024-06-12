import { Group } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import LinkedAvatar from './LinkedAvatar';
import DoubleText from './DoubleText';
import { parseTime } from '../utils';

type Props = {
  user: SmUser;
  createdAt: Date;
};

export default function AvatarWithDateText(props: Props) {
  return (
    <Group spacing={8}>
      <LinkedAvatar {...props.user} />
      <div>
        <DoubleText
          text={props.user.nick}
          subtext={parseTime(props.createdAt)}
          bold
          dimmed
        />
      </div>
    </Group>
  );
}
