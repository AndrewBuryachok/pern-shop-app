import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { City } from './city.model';
import { useAddCityUserMutation, useSelectMyCitiesQuery } from './cities.api';
import { useSelectNotCitizensUsersQuery } from '../users/users.api';
import { UpdateCityUserDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectCities, selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = {
  data?: City;
};

export default function AddCityUserModal({ data }: Props) {
  const form = useForm({
    initialValues: {
      city: data?.id ? `${data.id}` : '',
      user: '',
    },
    transformValues: ({ user, city }) => ({
      userId: +user,
      cityId: +city,
    }),
  });

  const { data: cities, ...citiesResponse } = useSelectMyCitiesQuery();
  const { data: users, ...usersResponse } = useSelectNotCitizensUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addCityUser, { isLoading }] = useAddCityUserMutation();

  const handleSubmit = async (dto: UpdateCityUserDto) => {
    await addCityUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Add city user'}
    >
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
    </CustomForm>
  );
}

export const addCityUserButton = {
  label: 'Add',
  open: () =>
    openModal({
      title: 'Add City User',
      children: <AddCityUserModal />,
    }),
};

export const addCityUserAction = {
  open: (city: City) =>
    openModal({
      title: 'Add City User',
      children: <AddCityUserModal data={city} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
