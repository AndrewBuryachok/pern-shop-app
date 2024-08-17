import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useTakeTaskMutation } from './tasks.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { TakeTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Task> & { hasRole: boolean };

export default function TakeTaskModal({ data: task, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
      user: '',
      card: '',
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [takeTask, { isLoading }] = useTakeTaskMutation();

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
        icon={<CustomAvatar {...task.customerCard.user} />}
        iconWidth={48}
        value={parseCard(task.customerCard)}
        readOnly
      />
      <Textarea label={t('columns.activity')} value={task.activity} readOnly />
      <Textarea label={t('columns.text')} value={task.text} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${task.price} ${t('constants.currency')}`}
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
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={
          <RefetchAction
            {...cardsResponse}
            skip={!form.values.user && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        readOnly={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
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
