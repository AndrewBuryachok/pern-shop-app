import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Farm } from './farm.model';
import { useSelectFarmUsersQuery } from './farms.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<Farm>;

export default function ViewFarmUsersModal({ data: farm }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectFarmUsersQuery(farm.id);

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

export const openViewFarmUsersAction = (farm: Farm) =>
  openModal({
    title: t('columns.users'),
    children: <ViewFarmUsersModal data={farm} />,
  });
