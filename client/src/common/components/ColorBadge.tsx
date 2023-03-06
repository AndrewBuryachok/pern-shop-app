import { Badge, Group } from '@mantine/core';

type Props = {
  color: string;
};

export default function StatusBadge(props: Props) {
  return (
    <Group spacing={0}>
      <Badge size='xs' variant='filled' color={props.color} />
    </Group>
  );
}
