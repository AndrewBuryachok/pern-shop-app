import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateCityMutation } from './cities.api';
import { CreateCityDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

export default function CreateCityModal() {
  const form = useForm({
    initialValues: {
      name: '',
      x: 0,
      y: 0,
    },
  });

  const [createCity, { isLoading }] = useCreateCityMutation();

  const handleSubmit = async (dto: CreateCityDto) => {
    await createCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create city'}
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

export const createCityButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create City',
      children: <CreateCityModal />,
    }),
};
