import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from './town.model';
import { useSelectTownUsersQuery } from './towns.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<Town>;

export default function ViewTownUsersModal({ data: town }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectTownUsersQuery(town.id);

  return (
    <Select
      label={t('columns.users')}
      placeholder={`${t('components.total')}: ${users?.length || 0}`}
      rightSection={<RefetchAction {...usersResponse} />}
      itemComponent={UsersItem}
      data={viewUsers(users || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewTownUsersAction = (town: Town) =>
  openModal({
    title: t('columns.users'),
    children: <ViewTownUsersModal data={town} />,
  });
