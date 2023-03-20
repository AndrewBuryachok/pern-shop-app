import { Group } from '@mantine/core';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';

type Props = {
  name: string;
  status: boolean;
};

export default function CustomAvatarWithText(props: Props) {
  return (
    <Group spacing={8}>
      <CustomAvatar {...props} />
      <SingleText text={props.name} />
    </Group>
  );
}
