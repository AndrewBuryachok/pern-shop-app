import { Badge, Group, HoverCard } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import AvatarWithSingleText from './AvatarWithSingleText';
import { colors } from '../constants';

type Props = {
  executorUser?: SmUser;
  status: number;
};

export default function StatusWithSingleAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <Group spacing={0}>
          <Badge size='xs' variant='filled' color={colors[props.status - 1]} />
        </Group>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4} hidden={!props.executorUser}>
        {props.executorUser && <AvatarWithSingleText {...props.executorUser} />}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
