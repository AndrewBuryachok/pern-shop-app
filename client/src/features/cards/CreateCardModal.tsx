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
import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateCardModal({ hasRole }: Props) {
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
    console.log(hasRole);
    await createCard(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create card'}
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
      <Select
        label='Color'
        placeholder='Color'
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
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Card',
      children: <CreateCardModal hasRole={hasRole} />,
    }),
});

export const createMyCardButton = createCardFactory(false);

export const createUserCardButton = createCardFactory(true);
