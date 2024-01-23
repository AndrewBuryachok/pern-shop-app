import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useTakeMyTaskMutation, useTakeUserTaskMutation } from './tasks.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { TakeTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color, priorities, Status } from '../../common/constants';

type Props = IModal<Task> & { hasRole: boolean };

export default function TakeTaskModal({ data: task, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [takeTask, { isLoading }] = hasRole
    ? useTakeUserTaskMutation()
    : useTakeMyTaskMutation();

  const handleSubmit = async (dto: TakeTaskDto) => {
    await takeTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...task.customerUser} />}
        iconWidth={48}
        value={task.customerUser.nick}
        readOnly
      />
      <TextInput label={t('columns.title')} value={task.title} readOnly />
      <Textarea label={t('columns.text')} value={task.text} autosize readOnly />
      <TextInput
        label={t('columns.priority')}
        icon={<PriorityIcon {...task} />}
        iconWidth={48}
        value={t(`constants.priorities.${priorities[task.priority - 1]}`)}
        readOnly
      />
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
    </CustomForm>
  );
}

export const takeTaskFactory = (hasRole: boolean) => ({
  open: (task: Task) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.tasks'),
      children: <TakeTaskModal data={task} hasRole={hasRole} />,
    }),
  disable: (task: Task) => task.status !== Status.CREATED,
  color: Color.GREEN,
});

export const takeMyTaskAction = takeTaskFactory(false);

export const takeUserTaskAction = takeTaskFactory(true);
