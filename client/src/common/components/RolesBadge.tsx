import { useTranslation } from 'react-i18next';
import { Badge, Group } from '@mantine/core';
import { colors, roles } from '../constants';

type Props = {
  roles: number[];
};

export default function RolesBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <Group spacing={4}>
      {props.roles.map((role) => (
        <Badge key={role} size='xs' color={colors[role - 1]}>
          {t('constants.roles.' + roles[role - 1])}
        </Badge>
      ))}
      {!props.roles.length && (
        <Badge size='xs' color='blue'>
          {t('constants.roles.user')}
        </Badge>
      )}
    </Group>
  );
}
