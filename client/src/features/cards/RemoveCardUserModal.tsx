import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();

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
      text={
        t('actions.remove') + ' ' + t('modals.card') + ' ' + t('modals.user')
      }
    >
      <TextInput label={t('columns.card')} value={card.name} disabled />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(card.users).filter(
          (user) => user.id !== card.user.id,
        )}
        limit={20}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeCardUserFactory = (hasRole: boolean) => ({
  open: (card: Card) =>
    openModal({
      title:
        t('actions.remove') + ' ' + t('modals.card') + ' ' + t('modals.user'),
      children: <RemoveCardUserModal data={card} />,
    }),
  disable: (card: Card) => {
    const user = getCurrentUser()!;
    return (card.user.id !== user.id && !hasRole) || card.users.length === 1;
  },
  color: Color.RED,
});

export const removeMyCardUserAction = removeCardUserFactory(false);

export const removeUserCardUserAction = removeCardUserFactory(true);
