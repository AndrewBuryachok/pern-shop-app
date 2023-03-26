import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAddUserCityMutation } from './users.api';
import { useSelectMyCitiesQuery } from '../cities/cities.api';
import { useSelectFreeUsersQuery } from './users.api';
import { UpdateUserCityDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectCities, selectUsers } from '../../common/utils';

export default function AddUserCityModal() {
  const form = useForm({
    initialValues: {
      user: '',
      city: '',
    },
    transformValues: ({ user, city }) => ({
      userId: +user,
      cityId: +city,
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
      text={'Add user city'}
    >
      <Select
        label='User'
        placeholder='User'
        icon={
          form.values.user && (
            <CustomAvatar
              {...users?.find((user) => user.id === +form.values.user)!}
            />
          )
        }
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        {...form.getInputProps('user')}
      />
      <Select
        label='City'
        placeholder='City'
        data={selectCities(cities)}
        searchable
        required
        {...form.getInputProps('city')}
      />
    </CustomForm>
  );
}

export const addUserCityButton = {
  label: 'Add User',
  open: () =>
    openModal({
      title: 'Add User City',
      children: <AddUserCityModal />,
    }),
};
