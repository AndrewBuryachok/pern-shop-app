import { Group } from '@mantine/core';
import { SmReply } from '../../features/replies/reply.model';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';
import CustomHighlight from './CustomHighlight';

type Props = SmReply;

export default function ReplyAvatarWithText(props: Props) {
  return (
    <Group spacing={8} align='flex-start' noWrap>
      <CustomAvatar {...props.user} />
      <div>
        <SingleText text={props.user.nick} />
        <CustomHighlight text={props.text} />
      </div>
    </Group>
  );
}
