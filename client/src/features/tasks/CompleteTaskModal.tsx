import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  CloseButton,
  Group,
  Input,
  Rating,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useCompleteTaskMutation } from './tasks.api';
import { CompleteTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function CompleteTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
      rate: 0,
    },
  });

  const [completeTask, { isLoading }] = useCompleteTaskMutation();

  const handleSubmit = async (dto: CompleteTaskDto) => {
    await completeTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...task.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(task.executorCard!)}
        readOnly
      />
      <Textarea label={t('columns.activity')} value={task.activity} readOnly />
      <Textarea label={t('columns.text')} value={task.text} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${task.price} ${t('constants.currency')}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
    </CustomForm>
  );
}

export const completeTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.tasks'),
      children: <CompleteTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.EXECUTED,
  color: Color.GREEN,
};
