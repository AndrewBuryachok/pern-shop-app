import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseStore, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rent>;

export default function ViewRentModal({ data: rent }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={rent.id} readOnly />
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...rent.card.user} />}
        iconWidth={48}
        value={parseCard(rent.card)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(rent.store.market.card)}
        readOnly
      />
      <TextInput
        label={t('columns.storage')}
        value={parseStore(rent.store)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${rent.store.market.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(rent.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(rent.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewRentAction = {
  open: (rent: Rent) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.rents'),
      children: <ViewRentModal data={rent} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
