import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyRatingMutation,
  useCreateUserRatingMutation,
} from './ratings.api';
import {
  useSelectAllUsersQuery,
  useSelectNotRatedUsersQuery,
} from '../users/users.api';
import { ExtCreateRatingDto } from './rating.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

type Props = { hasRole: boolean };

export default function CreateRatingModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      senderUser: '',
      receiverUser: '',
      rate: 5,
    },
    transformValues: ({ senderUser, receiverUser, ...rest }) => ({
      ...rest,
      senderUserId: +senderUser,
      receiverUserId: +receiverUser,
    }),
  });

  const { data: users, ...usersResponse } = hasRole
    ? useSelectAllUsersQuery()
    : useSelectNotRatedUsersQuery();

  const senderUser = users?.find((user) => user.id === +form.values.senderUser);
  const receiverUser = users?.find(
    (user) => user.id === +form.values.receiverUser,
  );

  const [createRating, { isLoading }] = hasRole
    ? useCreateUserRatingMutation()
    : useCreateMyRatingMutation();

  const handleSubmit = async (dto: ExtCreateRatingDto) => {
    await createRating(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.ratings')}
    >
      {hasRole && (
        <Select
          label={t('columns.sender')}
          placeholder={t('columns.sender')}
          icon={senderUser && <CustomAvatar {...senderUser} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('senderUser')}
        />
      )}
      <Select
        label={t('columns.receiver')}
        placeholder={t('columns.receiver')}
        icon={receiverUser && <CustomAvatar {...receiverUser} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users?.filter((user) => user.id !== senderUser?.id))}
        limit={20}
        searchable
        required
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('receiverUser')}
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const createRatingFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.ratings'),
      children: <CreateRatingModal hasRole={hasRole} />,
    }),
});

export const createMyRatingButton = createRatingFactory(false);

export const createUserRatingButton = createRatingFactory(true);
