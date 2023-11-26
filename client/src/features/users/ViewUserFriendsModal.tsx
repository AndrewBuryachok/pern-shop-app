import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtUser } from './user.model';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<ExtUser>;

export default function ViewUserFriendsModal({ data: user }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <Select
        label={t('columns.friends')}
        placeholder={`${t('components.total')}: ${user.friends.length}`}
        itemComponent={UsersItem}
        data={viewUsers(user.friends)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const openViewUserModal = (user: ExtUser) =>
  openModal({
    title:
      t('actions.view') + ' ' + t('modals.friends') + ' ' + t('modals.user'),
    children: <ViewUserFriendsModal data={user} />,
  });
