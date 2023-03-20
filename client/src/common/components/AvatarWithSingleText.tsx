import { Group } from '@mantine/core';
import { SmUser } from '../../features/users/user.model';
import LinkedAvatar from './LinkedAvatar';
import SingleText from './SingleText';

type Props = SmUser;

export default function AvatarWithSingleText(props: Props) {
  return (
    <Group spacing={8}>
      <LinkedAvatar {...props} />
      <SingleText text={props.name} />
    </Group>
  );
}
