import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useAddCityUserMutation } from './cities.api';
import { useSelectNotCitizensUsersQuery } from '../users/users.api';
import { UpdateCityUserDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parsePlace, selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function AddCityUserModal({ data: city }: Props) {
  const form = useForm({
    initialValues: {
      cityId: city.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

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
      <TextInput label='City' value={parsePlace(city)} disabled />
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

export const addCityUserFactory = (hasRole: boolean) => ({
  open: (city: City) =>
    openModal({
      title: 'Add City User',
      children: <AddCityUserModal data={city} />,
    }),
  disable: (city: City) => {
    const user = getCurrentUser()!;
    return city.user.id !== user.id && !hasRole;
  },
  color: Color.GREEN,
});

export const addMyCityUserAction = addCityUserFactory(false);

export const addUserCityUserAction = addCityUserFactory(true);
