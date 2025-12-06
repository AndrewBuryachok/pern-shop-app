import { HoverCard } from '@mantine/core';
import { MdCard } from '../../features/cards/card.model';
import StatusBadge from './StatusBadge';
import AvatarWithDoubleText from './AvatarWithDoubleText';

type Props = {
  status: number;
  executorCard?: MdCard;
};

export default function StatusBadgeWithAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <div>
          <StatusBadge status={props.status} />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4} hidden={!props.executorCard}>
        {props.executorCard && <AvatarWithDoubleText {...props.executorCard} />}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
