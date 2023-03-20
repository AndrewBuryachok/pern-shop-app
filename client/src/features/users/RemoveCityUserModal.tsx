import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { useRemoveUserCityMutation } from './users.api';
import { UpdateUserCityDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function RemoveCityUserModal({ data: user }: Props) {
  const form = useForm({
    initialValues: {
      cityId: user.city!.id,
      userId: user.id,
    },
  });

  const [removeUserCity, { isLoading }] = useRemoveUserCityMutation();

  const handleSubmit = async (dto: UpdateUserCityDto) => {
    await removeUserCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Remove city user'}
    >
      <TextInput label='City' value={user.city!.name} disabled />
      <TextInput
        label='User'
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.name}
        disabled
      />
    </CustomForm>
  );
}

export const removeCityUserAction = {
  open: (user: User) =>
    openModal({
      title: 'Remove City User',
      children: <RemoveCityUserModal data={user} />,
    }),
  disable: () => false,
  color: Color.RED,
};
