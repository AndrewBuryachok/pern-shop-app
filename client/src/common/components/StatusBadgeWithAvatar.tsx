import { Badge, Group, HoverCard } from '@mantine/core';
import { MdCard } from '../../features/cards/card.model';
import AvatarWithDoubleText from './AvatarWithDoubleText';
import { colors } from '../constants';

type Props = {
  executorCard?: MdCard;
  status: number;
};

export default function StatusBadgeWithAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <Group spacing={0}>
          <Badge size='xs' variant='filled' color={colors[props.status - 1]} />
        </Group>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4} hidden={!props.executorCard}>
        {props.executorCard && <AvatarWithDoubleText {...props.executorCard} />}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
