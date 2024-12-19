import { CloseButton, Group } from '@mantine/core';
import { SmReply } from '../../features/replies/reply.model';
import ReplyAvatarWithText from './ReplyAvatarWithText';

type Props = SmReply & {
  close: () => void;
};

export default function ReplyAvatarWithClose(props: Props) {
  return (
    <Group spacing={0} position='apart' noWrap>
      <ReplyAvatarWithText {...props} />
      <CloseButton size={24} iconSize={16} onClick={props.close} />
    </Group>
  );
}
