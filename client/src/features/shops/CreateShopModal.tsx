import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateShopMutation } from './shops.api';
import { CreateShopDto } from './shop.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

export default function CreateShopModal() {
  const form = useForm({
    initialValues: {
      name: '',
      x: 0,
      y: 0,
    },
  });

  const [createShop, { isLoading }] = useCreateShopMutation();

  const handleSubmit = async (dto: CreateShopDto) => {
    await createShop(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create shop'}
    >
      <TextInput
        label='Name'
        placeholder='Name'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('name')}
      />
      <NumberInput
        label='X'
        placeholder='X'
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('x')}
      />
      <NumberInput
        label='Y'
        placeholder='Y'
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('y')}
      />
    </CustomForm>
  );
}

export const createShopButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Shop',
      children: <CreateShopModal />,
    }),
};
