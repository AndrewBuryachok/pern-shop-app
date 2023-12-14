import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItem } from '../../common/components/ThingItem';
import {
  parseCard,
  parseStore,
  parseTime,
  viewThings,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rent>;

export default function ViewRentModal({ data: rent }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={rent.id} disabled />
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...rent.card.user} />}
        iconWidth={48}
        value={parseCard(rent.card)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(rent.store.market.card)}
        disabled
      />
      <TextInput
        label={t('columns.storage')}
        value={parseStore(rent.store)}
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${rent.store.market.price}$`}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(rent.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(rent.completedAt)}
        disabled
      />
      <Select
        label={t('columns.wares')}
        placeholder={`${t('components.total')}: ${rent.wares.length}`}
        itemComponent={ThingsItem}
        data={viewThings(rent.wares)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewRentAction = {
  open: (rent: Rent) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.rent'),
      children: <ViewRentModal data={rent} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
