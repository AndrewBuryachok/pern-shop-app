import { useTranslation } from 'react-i18next';
import { Badge, Group } from '@mantine/core';
import { roles, rolesToColors } from '../constants';

type Props = {
  roles: number[];
};

export default function RolesBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <Group spacing={4}>
      {props.roles.map((role) => (
        <Badge key={role} size='xs' color={rolesToColors[role - 1]}>
          {t(`constants.roles.${roles[role - 1]}`)}
        </Badge>
      ))}
      {!props.roles.length && (
        <Badge size='xs' color='gray'>
          {t('constants.roles.user')}
        </Badge>
      )}
    </Group>
  );
}
