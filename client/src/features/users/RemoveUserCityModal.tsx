import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useRemoveCityUserMutation } from '../cities/cities.api';
import { UpdateCityUserDto } from '../cities/city.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parsePlace } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function RemoveUserCityModal({ data: user }: Props) {
  const form = useForm({
    initialValues: {
      userId: user.id,
      cityId: user.city!.id,
    },
  });

  const [removeUserCity, { isLoading }] = useRemoveCityUserMutation();

  const handleSubmit = async (dto: UpdateCityUserDto) => {
    await removeUserCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Remove user city'}
    >
      <TextInput
        label='User'
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.name}
        disabled
      />
      <TextInput label='City' value={parsePlace(user.city!)} disabled />
    </CustomForm>
  );
}

export const removeUserCityAction = {
  open: (user: User) =>
    openModal({
      title: 'Remove User City',
      children: <RemoveUserCityModal data={user} />,
    }),
  disable: (user: User) => {
    const me = getCurrentUser()!;
    return user.city!.user.id !== me.id || user.id === me.id;
  },
  color: Color.RED,
};
