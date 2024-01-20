import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtUser } from './user.model';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<ExtUser>;

export default function ViewUserSubscribersModal({ data: user }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <Select
        label={t('columns.subscribers')}
        placeholder={`${t('components.total')}: ${user.subscribers.length}`}
        itemComponent={UsersItem}
        data={viewUsers(user.subscribers)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const openViewUserSubscribersModal = (user: ExtUser) =>
  openModal({
    title: t('columns.subscribers'),
    children: <ViewUserSubscribersModal data={user} />,
  });
