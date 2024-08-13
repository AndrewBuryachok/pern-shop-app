import { HoverCard } from '@mantine/core';
import { MdCard } from '../../features/cards/card.model';
import CustomBadge from './CustomBadge';
import AvatarWithDoubleText from './AvatarWithDoubleText';
import { parseStatus } from '../utils';

type Props = {
  status: number;
  executorCard?: MdCard;
};

export default function StatusBadge(props: Props) {
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
