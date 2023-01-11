import { NativeSelect, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { viewThings } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function ViewShopModal({ data: shop }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput label='Owner' value={shop.user.name} disabled />
      <TextInput label='Shop' value={shop.name} disabled />
      <TextInput label='X' value={shop.x} disabled />
      <TextInput label='Y' value={shop.y} disabled />
      <NativeSelect label='Goods' data={viewThings(shop.goods)} />
    </Stack>
  );
}

export const viewShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: 'View Shop',
      children: <ViewShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
