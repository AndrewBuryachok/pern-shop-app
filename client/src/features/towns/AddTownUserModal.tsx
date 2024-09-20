import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from './town.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useAddTownUserMutation } from './towns.api';
import { useSelectNotCitizensUsersQuery } from '../users/users.api';
import { UpdateTownUserDto } from './town.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parsePlace, selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Town>;

export default function AddTownUserModal({ data: town }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      townId: town.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectNotCitizensUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addTownUser, { isLoading }] = useAddTownUserMutation();

  const handleSubmit = async (dto: UpdateTownUserDto) => {
    await addTownUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.town')} value={parsePlace(town)} readOnly />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        limit={20}
        searchable
        required
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const addTownUserFactory = (hasRole: boolean) => ({
  open: (town: Town) =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.users'),
      children: <AddTownUserModal data={town} />,
    }),
  disable: (town: Town) => {
    const user = getCurrentUser()!;
    return town.user.id !== user.id && !hasRole;
  },
  color: Color.GREEN,
});

export const addMyTownUserAction = addTownUserFactory(false);

export const addUserTownUserAction = addTownUserFactory(true);
