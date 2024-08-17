import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateTaskMutation } from './tasks.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import {
  MAX_ACTIVITY_LENGTH,
  MAX_PRICE_VALUE,
  MAX_TEXT_LENGTH,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateTaskModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      activity: '',
      text: '',
      price: 1,
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
    validate: {
      card: (_, values) =>
        myCard.balance < values.price ? t('errors.not_enough_balance') : null,
    },
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

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = async (dto: CreateTaskDto) => {
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
      <Textarea
        label={t('columns.activity')}
        placeholder={t('columns.activity')}
        required
        maxLength={MAX_ACTIVITY_LENGTH}
        {...form.getInputProps('activity')}
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={customMin(MAX_PRICE_VALUE, myCard.balance)}
        {...form.getInputProps('price')}
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
