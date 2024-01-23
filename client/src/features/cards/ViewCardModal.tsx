import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import { useSelectCardUsersQuery } from './cards.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parseTime, viewUsers } from '../../common/utils';
import { Color, colors } from '../../common/constants';

type Props = IModal<Card>;

export default function ViewCardModal({ data: card }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectCardUsersQuery(card.id);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={card.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...card.user} />}
        iconWidth={48}
        value={card.user.nick}
        readOnly
      />
      <TextInput label={t('columns.card')} value={card.name} readOnly />
      <TextInput
        label={t('columns.color')}
        value={t(`constants.colors.${colors[card.color - 1]}`)}
        readOnly
      />
      <TextInput
        label={t('columns.balance')}
        value={`${card.balance} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(card.createdAt)}
        readOnly
      />
      <Select
        label={t('columns.users')}
        placeholder={`${t('components.total')}: ${users?.length || 0}`}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={viewUsers(users || [])}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewCardAction = {
  open: (card: Card) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.cards'),
      children: <ViewCardModal data={card} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
