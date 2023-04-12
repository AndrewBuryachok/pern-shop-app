import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useAddUserCityMutation,
  useSelectNotCitizensUsersQuery,
} from './users.api';
import { useSelectMyCitiesQuery } from '../cities/cities.api';
import { UpdateUserCityDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { PlacesItem } from '../../common/components/PlacesItem';
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

  const { data: users, ...usersResponse } = useSelectNotCitizensUsersQuery();
  const { data: cities, ...citiesResponse } = useSelectMyCitiesQuery();

  const user = users?.find((user) => user.id === +form.values.user);

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
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
      <Select
        label='City'
        placeholder='City'
        rightSection={<RefetchAction {...citiesResponse} />}
        itemComponent={PlacesItem}
        data={selectCities(cities)}
        searchable
        required
        disabled={citiesResponse.isFetching}
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
