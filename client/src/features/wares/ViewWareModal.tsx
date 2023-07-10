import {
  Input,
  Rating,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseDate,
  parseStore,
  parseThingAmount,
  viewStates,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Ware>;

export default function ViewWareModal({ data: ware }: Props) {
  const created = parseDate(ware.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...ware} />}
        iconWidth={48}
        value={items[ware.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={ware.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(ware)} disabled />
      <TextInput label='Price' value={`${ware.price}$`} disabled />
      <Select
        label='Prices'
        placeholder={`Total: ${ware.states.length}`}
        itemComponent={StatesItem}
        data={viewStates(ware.states)}
        searchable
      />
      <TextInput label='Market' value={parseStore(ware.rent.store)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...ware.rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.store.market.card)}
        disabled
      />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
      <Input.Wrapper label='Rate'>
        <Rating value={ware.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewWareAction = {
  open: (ware: Ware) =>
    openModal({
      title: 'View Ware',
      children: <ViewWareModal data={ware} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
