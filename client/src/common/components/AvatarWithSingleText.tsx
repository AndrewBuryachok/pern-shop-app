import { Group } from '@mantine/core';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';

type Props = {
  id: number;
  name: string;
};

export default function AvatarWithSingleText(props: Props) {
  return (
    <Group spacing={8}>
      <CustomAvatar id={props.id} name={props.name} />
      <SingleText text={props.name} />
    </Group>
  );
}
