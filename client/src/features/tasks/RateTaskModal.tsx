import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useRateTaskMutation } from './tasks.api';
import { RateTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function RateTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
      rate: 5,
    },
  });

  const [rateTask, { isLoading }] = useRateTaskMutation();

  const handleSubmit = async (dto: RateTaskDto) => {
    await rateTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...task.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(task.executorCard!)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={task.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${task.price} ${t('constants.currency')}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.tasks'),
      children: <RateTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.COMPLETED || !!task.rate,
  color: Color.YELLOW,
};
