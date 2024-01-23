import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyCardMutation,
  useCreateUserCardMutation,
} from './cards.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreateCardDto } from './card.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { ColorsItem } from '../../common/components/ColorsItem';
import { selectColors, selectUsers } from '../../common/utils';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateCardModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      name: '',
      color: '',
    },
    transformValues: ({ user, color, ...rest }) => ({
      ...rest,
      userId: +user,
      color: +color,
    }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createCard, { isLoading }] = hasRole
    ? useCreateUserCardMutation()
    : useCreateMyCardMutation();

  const handleSubmit = async (dto: ExtCreateCardDto) => {
    await createCard(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.cards')}
    >
      {hasRole && (
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
      )}
      <TextInput
        label={t('columns.name')}
        placeholder={t('columns.name')}
        required
        minLength={MIN_NAME_LENGTH}
        maxLength={MAX_NAME_LENGTH}
        {...form.getInputProps('name')}
      />
      <Select
        label={t('columns.color')}
        placeholder={t('columns.color')}
        itemComponent={ColorsItem}
        data={selectColors()}
        searchable
        required
        {...form.getInputProps('color')}
      />
    </CustomForm>
  );
}

export const createCardFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.cards'),
      children: <CreateCardModal hasRole={hasRole} />,
    }),
});

export const createMyCardButton = createCardFactory(false);

export const createUserCardButton = createCardFactory(true);
