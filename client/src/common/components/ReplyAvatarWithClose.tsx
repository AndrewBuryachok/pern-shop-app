import { ActionIcon, Group } from '@mantine/core';
import { IconX } from '@tabler/icons';
import { SmReply } from '../../features/replies/reply.model';
import ReplyAvatarWithText from './ReplyAvatarWithText';

type Props = SmReply & {
  close: () => void;
};

export default function ReplyAvatarWithClose(props: Props) {
  return (
    <Group spacing={8} noWrap>
      <ActionIcon size={24} variant='filled' color='red' onClick={props.close}>
        <IconX size={16} />
      </ActionIcon>
      <ReplyAvatarWithText {...props} />
    </Group>
  );
}
