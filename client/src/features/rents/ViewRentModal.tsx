import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import { useSelectRentThingsQuery } from './rents.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
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

  const { data: things, ...thingsResponse } = useSelectRentThingsQuery(rent.id);

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
        label={t('columns.things')}
        placeholder={`${t('components.total')}: ${things?.length || 0}`}
        rightSection={<RefetchAction {...thingsResponse} />}
        itemComponent={ThingsItemWithAmount}
        data={viewThings(things || [])}
        limit={20}
        searchable
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
