import { NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyCityMutation,
  useCreateUserCityMutation,
} from './cities.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreateCityDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import {
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateCityModal({ hasRole }: Props) {
  const form = useForm({
    initialValues: {
      user: '',
      name: '',
      x: 0,
      y: 0,
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createCity, { isLoading }] = hasRole
    ? useCreateUserCityMutation()
    : useCreateMyCityMutation();

  const handleSubmit = async (dto: ExtCreateCityDto) => {
    await createCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create city'}
    >
      {hasRole && (
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
      )}
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

export const createCityFactory = (hasRole: boolean) => ({
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create City',
      children: <CreateCityModal hasRole={hasRole} />,
    }),
});

export const createMyCityButton = createCityFactory(false);

export const createUserCityButton = createCityFactory(true);
