import { HoverCard } from '@mantine/core';
import { SmPlaceWithUser } from '../../features/places/place.model';
import PlaceText from './PlaceText';
import AvatarWithSingleText from './AvatarWithSingleText';

type Props = SmPlaceWithUser;

export default function PlaceWithSingleAvatar(props: Props) {
  return (
    <HoverCard position='left' withArrow>
      <HoverCard.Target>
        <div>
          <PlaceText {...props} />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown p={4}>
        <AvatarWithSingleText {...props.user} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
