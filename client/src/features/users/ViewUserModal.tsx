import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ColorsItem } from '../../common/components/ColorsItem';
import { parsePlace, parseTime, viewRoles } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function ViewUserModal({ data: user }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={user.id} readOnly />
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        readOnly
      />
      <Select
        label={t('columns.roles')}
        itemComponent={ColorsItem}
        placeholder={`${t('components.total')}: ${user.roles.length}`}
        data={viewRoles(user.roles)}
        searchable
      />
      <TextInput
        label={t('columns.city')}
        value={user.city ? parsePlace(user.city) : '-'}
        readOnly
      />
      <TextInput
        label={t('columns.online')}
        value={parseTime(user.onlineAt)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(user.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewUserAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.users'),
      children: <ViewUserModal data={user} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
