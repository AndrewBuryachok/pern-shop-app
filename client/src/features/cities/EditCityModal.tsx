import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditCityMutation } from './cities.api';
import { EditCityDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<City>;

export default function EditCityModal({ data: city }: Props) {
  const form = useForm({
    initialValues: {
      cityId: city.id,
      name: city.name,
      x: city.x,
      y: city.y,
    },
  });

  const [editCity, { isLoading }] = useEditCityMutation();

  const handleSubmit = async (dto: EditCityDto) => {
    await editCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit city'}
      isChanged={!form.isDirty()}
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

export const editCityFactory = (hasRole: boolean) => ({
  open: (city: City) =>
    openModal({
      title: 'Edit City',
      children: <EditCityModal data={city} />,
    }),
  disable: (city: City) => {
    const user = getCurrentUser()!;
    return city.user.id !== user.id && !hasRole;
  },
  color: Color.YELLOW,
});

export const editMyCityAction = editCityFactory(false);

export const editUserCityAction = editCityFactory(true);
