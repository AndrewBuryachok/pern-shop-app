import { useTranslation } from 'react-i18next';
import { Badge } from '@mantine/core';

export default function BannedBadge() {
  const [t] = useTranslation();

  return (
    <Badge size='sm' color='dark'>
      {t('constants.roles.banned')}
    </Badge>
  );
}
