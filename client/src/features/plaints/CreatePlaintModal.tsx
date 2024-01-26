import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyPlaintMutation,
  useCreateUserPlaintMutation,
} from './plaints.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreatePlaintDto } from './plaint.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { MAX_TITLE_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreatePlaintModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      senderUser: '',
      receiverUser: '',
      title: '',
    },
    transformValues: ({ senderUser, receiverUser, ...rest }) => ({
      ...rest,
      senderUserId: +senderUser,
      receiverUserId: +receiverUser,
    }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const senderUser = users?.find((user) => user.id === +form.values.senderUser);
  const receiverUser = users?.find(
    (user) => user.id === +form.values.receiverUser,
  );

  const [createPlaint, { isLoading }] = hasRole
    ? useCreateUserPlaintMutation()
    : useCreateMyPlaintMutation();

  const handleSubmit = async (dto: ExtCreatePlaintDto) => {
    await createPlaint(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.plaints')}
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
        data={selectUsers(users)}
        limit={20}
        searchable
        required
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('receiverUser')}
      />
      <TextInput
        label={t('columns.title')}
        placeholder={t('columns.title')}
        required
        maxLength={MAX_TITLE_LENGTH}
        {...form.getInputProps('title')}
      />
    </CustomForm>
  );
}

export const createPlaintFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.plaints'),
      children: <CreatePlaintModal hasRole={hasRole} />,
    }),
});

export const createMyPlaintButton = createPlaintFactory(false);

export const createUserPlaintButton = createPlaintFactory(true);
