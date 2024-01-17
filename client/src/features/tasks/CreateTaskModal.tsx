import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyTaskMutation,
  useCreateUserTaskMutation,
} from './tasks.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreateTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { PrioritiesItem } from '../../common/components/PrioritiesItem';
import { selectPriorities, selectUsers } from '../../common/utils';
import { MAX_TEXT_LENGTH, MAX_TITLE_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateTaskModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      title: '',
      text: '',
      priority: '',
    },
    transformValues: ({ user, priority, ...rest }) => ({
      ...rest,
      userId: +user,
      priority: +priority,
    }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createTask, { isLoading }] = hasRole
    ? useCreateUserTaskMutation()
    : useCreateMyTaskMutation();

  const handleSubmit = async (dto: ExtCreateTaskDto) => {
    await createTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.tasks')}
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
          disabled={usersResponse.isFetching}
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
      <Select
        label={t('columns.priority')}
        placeholder={t('columns.priority')}
        itemComponent={PrioritiesItem}
        data={selectPriorities()}
        searchable
        required
        {...form.getInputProps('priority')}
      />
    </CustomForm>
  );
}

export const createTaskFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.tasks'),
      children: <CreateTaskModal hasRole={hasRole} />,
    }),
});

export const createMyTaskButton = createTaskFactory(false);

export const createUserTaskButton = createTaskFactory(true);
