import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useRemoveCardUserMutation } from './cards.api';
import { UpdateCardUserDto } from './card.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Card>;

export default function RemoveCardUserModal({ data: card }: Props) {
  const form = useForm({
    initialValues: {
      cardId: card.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const user = card.users.find((user) => user.id === +form.values.user);

  const [removeCardUser, { isLoading }] = useRemoveCardUserMutation();

  const handleSubmit = async (dto: UpdateCardUserDto) => {
    await removeCardUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Remove card user'}
    >
      <TextInput label='Card' value={card.name} disabled />
      <Select
        label='User'
        placeholder='User'
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(card.users).filter(
          (user) => user.id !== card.user.id,
        )}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeCardUserAction = {
  open: (card: Card) =>
    openModal({
      title: 'Remove Card User',
      children: <RemoveCardUserModal data={card} />,
    }),
  disable: (card: Card) => {
    const user = getCurrentUser()!;
    return card.user.id !== user.id || card.users.length === 1;
  },
  color: Color.RED,
};
