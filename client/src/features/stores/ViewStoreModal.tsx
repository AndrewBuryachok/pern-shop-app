import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Store } from './store.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parsePlace, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Store>;

export default function ViewStoreModal({ data: store }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...store.market.card.user} />}
        iconWidth={48}
        value={parseCard(store.market.card)}
        disabled
      />
      <TextInput
        label={t('columns.market')}
        value={parsePlace(store.market)}
        disabled
      />
      <TextInput label={t('columns.store')} value={`#${store.name}`} disabled />
      <TextInput
        label={t('columns.price')}
        value={`${store.market.price}$`}
        disabled
      />
      <TextInput
        label={t('columns.reserved')}
        value={parseTime(store.reservedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewStoreAction = {
  open: (store: Store) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.store'),
      children: <ViewStoreModal data={store} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
