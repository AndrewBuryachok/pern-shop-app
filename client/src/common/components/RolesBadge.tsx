import { useTranslation } from 'react-i18next';
import { Badge, Group } from '@mantine/core';
import { Role, rolesToColors } from '../constants';

type Props = {
  roles: string[];
};

export default function RolesBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <Group spacing={4}>
      {props.roles.map((role) => (
        <Badge
          key={role}
          size='sm'
          color={rolesToColors[Object.values(Role).indexOf(role as Role)]}
        >
          {t(`constants.roles.${role}`)}
        </Badge>
      ))}
      {!props.roles.length && (
        <Badge size='sm' color='gray'>
          {t('constants.roles.user')}
        </Badge>
      )}
    </Group>
  );
}
