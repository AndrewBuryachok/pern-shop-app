import { HoverCard } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import CustomBadge from './CustomBadge';
import AvatarWithSingleText from './AvatarWithSingleText';
import { parseStatus } from '../utils';

type Props = {
  executorUser?: SmUser;
  status: number;
};

export default function StatusWithSingleAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <div>
          <CustomBadge color={props.status} text={parseStatus(props.status)} />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4} hidden={!props.executorUser}>
        {props.executorUser && <AvatarWithSingleText {...props.executorUser} />}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
