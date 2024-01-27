import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import { useSelectCardUsersQuery } from './cards.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<Card>;

export default function ViewCardUsersModal({ data: card }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectCardUsersQuery(card.id);

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

export const openViewCardUsersAction = (card: Card) =>
  openModal({
    title: t('columns.users'),
    children: <ViewCardUsersModal data={card} />,
  });
