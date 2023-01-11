import { NativeSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAddUserCityMutation } from './users.api';
import { useSelectMyCitiesQuery } from '../cities/cities.api';
import { useSelectFreeUsersQuery } from './users.api';
import { UpdateUserCityDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import { selectCities, selectUsers } from '../../common/utils';

export default function AddCityUserModal() {
  const form = useForm({
    initialValues: {
      city: '',
      user: '',
    },
    transformValues: ({ city, user }) => ({
      cityId: +city,
      userId: +user,
    }),
  });

  const { data: cities } = useSelectMyCitiesQuery();
  const { data: users } = useSelectFreeUsersQuery();

  const [addUserCity, { isLoading }] = useAddUserCityMutation();

  const handleSubmit = async (dto: UpdateUserCityDto) => {
    await addUserCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Add city user'}
    >
      <NativeSelect
        label='City'
        data={selectCities(cities)}
        required
        {...form.getInputProps('city')}
      />
      <NativeSelect
        label='User'
        data={selectUsers(users)}
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const addCityUserButton = {
  label: 'Add User',
  open: () =>
    openModal({
      title: 'Add City User',
      children: <AddCityUserModal />,
    }),
};
