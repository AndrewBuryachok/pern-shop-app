import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyPollMutation,
  useCreateUserPollMutation,
} from './polls.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreatePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { MAX_TEXT_LENGTH, MAX_TITLE_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreatePollModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      title: '',
      text: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createPoll, { isLoading }] = hasRole
    ? useCreateUserPollMutation()
    : useCreateMyPollMutation();

  const handleSubmit = async (dto: ExtCreatePollDto) => {
    await createPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.polls')}
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
        label={t('columns.title')}
        placeholder={t('columns.title')}
        required
        maxLength={MAX_TITLE_LENGTH}
        {...form.getInputProps('title')}
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const createPollFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.polls'),
      children: <CreatePollModal hasRole={hasRole} />,
    }),
});

export const createMyPollButton = createPollFactory(false);

export const createUserPollButton = createPollFactory(true);
