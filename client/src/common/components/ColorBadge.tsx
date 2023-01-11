import { Badge, Group } from '@mantine/core';
import { colors } from '../constants';

type Props = {
  color: number;
};

export default function StatusBadge(props: Props) {
  return (
    <Group spacing={0}>
      <Badge size='xs' variant='filled' color={colors[props.color - 1]} />
    </Group>
  );
}
