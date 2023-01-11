import { Group } from '@mantine/core';
import CustomAvatar from './CustomAvatar';
import DoubleText from './DoubleText';

type Props = {
  id: number;
  name: string;
  text: string;
  color: number;
};

export default function AvatarWithDoubleText(props: Props) {
  return (
    <Group spacing={8}>
      <CustomAvatar id={props.id} name={props.name} />
      <div>
        <DoubleText
          text={props.name}
          subtext={props.text}
          color={props.color}
        />
      </div>
    </Group>
  );
}
