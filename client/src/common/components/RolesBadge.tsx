import { Badge, Group } from '@mantine/core';
import { colors, roles } from '../constants';

type Props = {
  roles: number[];
};

export default function RolesBadge(props: Props) {
  return (
    <Group spacing={4}>
      {props.roles.map((role) => (
        <Badge key={role} size='xs' color={colors[role - 1]}>
          {roles[role - 1]}
        </Badge>
      ))}
      {!props.roles.length && (
        <Badge size='xs' color='blue'>
          User
        </Badge>
      )}
    </Group>
  );
}
