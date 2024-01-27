import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { useSelectCityUsersQuery } from './cities.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<City>;

export default function ViewCityUsersModal({ data: city }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectCityUsersQuery(city.id);

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

export const openViewCityUsersAction = (city: City) =>
  openModal({
    title: t('columns.users'),
    children: <ViewCityUsersModal data={city} />,
  });
