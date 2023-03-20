import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseDate, parsePlace, parseThingAmount } from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Good>;

export default function ViewGoodModal({ data: good }: Props) {
  const created = parseDate(good.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...good.shop.user} />}
        iconWidth={48}
        value={good.shop.user.name}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...good} />}
        iconWidth={48}
        value={items[good.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={good.description} disabled />
      <TextInput label='Shop' value={parsePlace(good.shop)} disabled />
      <TextInput label='Amount' value={parseThingAmount(good)} disabled />
      <TextInput label='Price' value={`${good.price}$`} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
    </Stack>
  );
}

export const viewGoodAction = {
  open: (good: Good) =>
    openModal({
      title: 'View Good',
      children: <ViewGoodModal data={good} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
