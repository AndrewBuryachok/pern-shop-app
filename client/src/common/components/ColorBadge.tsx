import { Badge, Group } from '@mantine/core';

type Props = {
  color: string;
};

export default function ColorBadge(props: Props) {
  return (
    <Group spacing={0}>
      <Badge size='xs' variant='filled' color={props.color} />
    </Group>
  );
}
