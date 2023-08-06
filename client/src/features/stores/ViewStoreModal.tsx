import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Store } from './store.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parsePlace, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Store>;

export default function ViewStoreModal({ data: store }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...store.market.card.user} />}
        iconWidth={48}
        value={parseCard(store.market.card)}
        disabled
      />
      <TextInput label='Market' value={parsePlace(store.market)} disabled />
      <TextInput label='Store' value={`#${store.name}`} disabled />
      <TextInput label='Price' value={`${store.market.price}$`} disabled />
      <TextInput
        label='Reserved'
        value={parseTime(store.reservedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewStoreAction = {
  open: (store: Store) =>
    openModal({
      title: 'View Store',
      children: <ViewStoreModal data={store} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
