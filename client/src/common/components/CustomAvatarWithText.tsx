import { Group } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';

type Props = SmUser;

export default function CustomAvatarWithText(props: Props) {
  return (
    <Group spacing={8}>
      <CustomAvatar {...props} />
      <SingleText text={props.name} />
    </Group>
  );
}
