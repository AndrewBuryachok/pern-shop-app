import { HoverCard } from '@mantine/core';
import { MdCard } from '../../features/cards/card.model';
import AvatarWithDoubleText from './AvatarWithDoubleText';
import CustomBadge from './CustomBadge';
import { parseStatus } from '../utils';

type Props = {
  executorCard?: MdCard;
  status: number;
};

export default function StatusWithDoubleAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <div>
          <CustomBadge color={props.status} text={parseStatus(props.status)} />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4} hidden={!props.executorCard}>
        {props.executorCard && <AvatarWithDoubleText {...props.executorCard} />}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
