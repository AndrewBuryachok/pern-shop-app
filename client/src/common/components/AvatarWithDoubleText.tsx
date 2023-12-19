import { Group } from '@mantine/core';
import { MdCard } from '../../features/cards/card.model';
import LinkedAvatar from './LinkedAvatar';
import DoubleText from './DoubleText';

type Props = MdCard;

export default function AvatarWithDoubleText(props: Props) {
  return (
    <Group spacing={8}>
      <LinkedAvatar {...props.user} />
      <div>
        <DoubleText
          text={props.user.nick}
          subtext={props.name}
          color={props.color}
        />
      </div>
    </Group>
  );
}
