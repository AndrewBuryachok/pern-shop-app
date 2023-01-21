import { NativeSelect, NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateWareMutation } from './wares.api';
import { useSelectMyRentsQuery } from '../rents/rents.api';
import { CreateWareDto } from './ware.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  selectCategories,
  selectItems,
  selectKits,
  selectRents,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

export default function CreateWareModal() {
  const form = useForm({
    initialValues: {
      rent: '',
      category: '',
      item: '',
      description: '-',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({ rent, item, kit, ...rest }) => ({
      ...rest,
      rentId: +rent,
      item: +item,
      kit: +kit,
    }),
  });

  const { data: rents } = useSelectMyRentsQuery();

  const [createWare, { isLoading }] = useCreateWareMutation();

  const handleSubmit = async (dto: CreateWareDto) => {
    await createWare(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create ware'}
    >
      <NativeSelect
        label='Rent'
        data={selectRents(rents)}
        required
        {...form.getInputProps('rent')}
      />
      <NativeSelect
        label='Category'
        data={selectCategories()}
        required
        {...form.getInputProps('category')}
      />
      <NativeSelect
        label='Item'
        data={selectItems().filter(
          (item) => item.category === form.values.category || !item.value,
        )}
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label='Amount'
        placeholder='Amount'
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label='Intake'
        placeholder='Intake'
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <NativeSelect
        label='Kit'
        data={selectKits()}
        required
        {...form.getInputProps('kit')}
      />
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createWareButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Ware',
      children: <CreateWareModal />,
    }),
};
