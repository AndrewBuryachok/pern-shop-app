import { Group } from '@mantine/core';
import { SmReply } from '../../features/replies/reply.model';
import CustomAvatar from './CustomAvatar';
import DoubleText from './DoubleText';

type Props = SmReply;

export default function ReplyAvatarWithText(props: Props) {
  return (
    <Group spacing={8} align='flex-start' noWrap>
      <CustomAvatar {...props.user} />
      <div>
        <DoubleText text={props.user.nick} subtext={props.text} />
      </div>
    </Group>
  );
}
