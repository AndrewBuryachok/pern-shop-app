import { HoverCard } from '@mantine/core';
import { PlaceWithCard } from '../../features/places/place.model';
import PlaceText from './PlaceText';
import AvatarWithDoubleText from './AvatarWithDoubleText';

type Props = PlaceWithCard & {
  container: number;
};

export default function PlaceWithDoubleAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <div>
          <PlaceText {...props} />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4}>
        <AvatarWithDoubleText {...props.card} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
