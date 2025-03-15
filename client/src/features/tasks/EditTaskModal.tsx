import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useEditTaskMutation } from './tasks.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { selectCardsWithBalance } from '../../common/utils';
import {
  Color,
  MAX_ACTIVITY_LENGTH,
  MAX_PRICE_VALUE,
  MAX_TEXT_LENGTH,
  Status,
} from '../../common/constants';

type Props = IModal<Task> & { hasRole: boolean };

export default function EditTaskModal({ data: task, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      taskId: task.id,
      activity: task.activity,
      text: task.text,
      price: task.price,
      card: `${task.customerCard.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: (_, values) =>
        task.price < values.price && myCard.balance < values.price - task.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(task.customerCard.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.account.balance || 0;

  const [editTask, { isLoading }] = useEditTaskMutation();

  const handleSubmit = async (dto: EditTaskDto) => {
    await editTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.tasks')}
      isChanged={!form.isDirty()}
    >
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
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
      <Select
        label={t('columns.card')}
        description={`${
          task.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(task.price - form.values.price)} ${t(
          'constants.currency',
        )}`}
        rightSection={<RefetchAction {...cardsResponse} />}
        data={selectCardsWithBalance(cards)}
        readOnly
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const editTaskFactory = (hasRole: boolean) => ({
  open: (task: Task) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.tasks'),
      children: <EditTaskModal data={task} hasRole={hasRole} />,
    }),
  disable: (task: Task) => task.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyTaskAction = editTaskFactory(false);

export const editUserTaskAction = editTaskFactory(true);
