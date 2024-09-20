import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from './town.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useRemoveTownUserMutation,
  useSelectTownUsersQuery,
} from './towns.api';
import { UpdateTownUserDto } from './town.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parsePlace, selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Town>;

export default function RemoveTownUserModal({ data: town }: Props) {
  const [t] = useTranslation();

  const { data: townUsers } = useSelectTownUsersQuery(town.id);

  const form = useForm({
    initialValues: {
      townId: town.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const user = townUsers?.find((user) => user.id === +form.values.user);

  const [removeTownUser, { isLoading }] = useRemoveTownUserMutation();

  const handleSubmit = async (dto: UpdateTownUserDto) => {
    await removeTownUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.town')} value={parsePlace(town)} readOnly />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(townUsers).filter((user) => user.id !== town.user.id)}
        limit={20}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeTownUserFactory = (hasRole: boolean) => ({
  open: (town: Town) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.users'),
      children: <RemoveTownUserModal data={town} />,
    }),
  disable: (town: Town) => {
    const user = getCurrentUser()!;
    return (town.user.id !== user.id && !hasRole) || town.users === 1;
  },
  color: Color.RED,
});

export const removeMyTownUserAction = removeTownUserFactory(false);

export const removeUserTownUserAction = removeTownUserFactory(true);
