import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';
import { Color, colors } from '../../common/constants';

type Props = IModal<Card>;

export default function ViewCardModal({ data: card }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={card.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...card.user} />}
        iconWidth={48}
        value={card.user.nick}
        disabled
      />
      <TextInput label={t('columns.card')} value={card.name} disabled />
      <TextInput
        label={t('columns.color')}
        value={t('constants.colors.' + colors[card.color - 1])}
        disabled
      />
      <TextInput
        label={t('columns.balance')}
        value={`${card.balance}$`}
        disabled
      />
      <Select
        label={t('columns.users')}
        placeholder={`${t('components.total')}: ${card.users.length}`}
        itemComponent={UsersItem}
        data={viewUsers(card.users)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewCardAction = {
  open: (card: Card) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.card'),
      children: <ViewCardModal data={card} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
