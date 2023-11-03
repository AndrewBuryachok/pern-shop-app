import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useRemoveCityUserMutation } from './cities.api';
import { UpdateCityUserDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parsePlace, selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function RemoveCityUserModal({ data: city }: Props) {
  const form = useForm({
    initialValues: {
      cityId: city.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const user = city.users.find((user) => user.id === +form.values.user);

  const [removeCityUser, { isLoading }] = useRemoveCityUserMutation();

  const handleSubmit = async (dto: UpdateCityUserDto) => {
    await removeCityUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Remove city user'}
    >
      <TextInput label='City' value={parsePlace(city)} disabled />
      <Select
        label='User'
        placeholder='User'
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(city.users).filter(
          (user) => user.id !== city.user.id,
        )}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeCityUserFactory = (hasRole: boolean) => ({
  open: (city: City) =>
    openModal({
      title: 'Remove City User',
      children: <RemoveCityUserModal data={city} />,
    }),
  disable: (city: City) => {
    const user = getCurrentUser()!;
    return (city.user.id !== user.id && !hasRole) || city.users.length === 1;
  },
  color: Color.RED,
});

export const removeMyCityUserAction = removeCityUserFactory(false);

export const removeUserCityUserAction = removeCityUserFactory(true);
