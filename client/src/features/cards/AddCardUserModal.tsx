import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useAddCardUserMutation } from './cards.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { UpdateCardUserDto } from './card.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Card>;

export default function AddCardUserModal({ data: card }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      cardId: card.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addCardUser, { isLoading }] = useAddCardUserMutation();

  const handleSubmit = async (dto: UpdateCardUserDto) => {
    await addCardUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.card')} value={card.name} disabled />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users).filter(
          (user) => !card.users.map((user) => user.id).includes(user.id),
        )}
        limit={20}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const addCardUserFactory = (hasRole: boolean) => ({
  open: (card: Card) =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.users'),
      children: <AddCardUserModal data={card} />,
    }),
  disable: (card: Card) => {
    const user = getCurrentUser()!;
    return card.user.id !== user.id && !hasRole;
  },
  color: Color.GREEN,
});

export const addMyCardUserAction = addCardUserFactory(false);

export const addUserCardUserAction = addCardUserFactory(true);
