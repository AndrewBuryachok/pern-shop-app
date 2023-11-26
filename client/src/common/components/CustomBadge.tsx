import { Badge, Group } from '@mantine/core';
import { colors } from '../constants';

type Props = {
  color?: number;
  text?: string;
};

export default function CustomBadge(props: Props) {
  return (
    <Group spacing={0}>
      <Badge size='xs' color={props.color ? colors[props.color - 1] : 'gray'}>
        {props.text}
      </Badge>
    </Group>
  );
}
