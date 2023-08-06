import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import { useEditWareMutation } from './wares.api';
import { EditWareDto } from './ware.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseStore,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE, items } from '../../common/constants';

type Props = IModal<Ware>;

export default function EditWareModal({ data: ware }: Props) {
  const form = useForm({
    initialValues: {
      wareId: ware.id,
      price: ware.price,
    },
  });

  const [editWare, { isLoading }] = useEditWareMutation();

  const handleSubmit = async (dto: EditWareDto) => {
    await editWare(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit ware'}
      isChanged={!form.isDirty()}
    >
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
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
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
      <TextInput label='Created' value={parseTime(ware.createdAt)} disabled />
    </CustomForm>
  );
}

export const editWareAction = {
  open: (ware: Ware) =>
    openModal({
      title: 'Edit Ware',
      children: <EditWareModal data={ware} />,
    }),
  disable: (ware: Ware) => !ware.amount,
  color: Color.YELLOW,
};
