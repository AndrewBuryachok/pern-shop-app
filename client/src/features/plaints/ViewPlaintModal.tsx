import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  Group,
  Input,
  Skeleton,
  Stack,
  Textarea,
  TextInput,
  Timeline,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { useSelectPlaintAnswersQuery } from './plaints.api';
import { Plaint } from './plaint.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { editAnswerAction } from '../answers/EditAnswerModal';
import { deleteAnswerAction } from '../answers/DeleteAnswerModal';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Plaint>;

export default function ViewPlaintModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const { data: answers, ...answersResponse } = useSelectPlaintAnswersQuery(
    plaint.id,
  );

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={plaint.id} readOnly />
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...plaint.senderUser} />}
        iconWidth={48}
        value={plaint.senderUser.nick}
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...plaint.receiverUser} />}
        iconWidth={48}
        value={plaint.receiverUser.nick}
        readOnly
      />
      <TextInput label={t('columns.title')} value={plaint.title} readOnly />
      <Input.Wrapper label={t('columns.answers')}>
        <Timeline bulletSize={32}>
          {answersResponse.isLoading && (
            <Timeline.Item title={<Skeleton w={64} h={16} />}>
              <Skeleton w={128} h={16} />
              <Skeleton w={128} h={16} />
            </Timeline.Item>
          )}
          {answers?.map((answer) => (
            <Timeline.Item
              key={answer.id}
              title={answer.user.nick}
              bullet={<CustomAvatar {...answer.user} />}
            >
              <Group spacing={0} position='apart' align='flex-start' noWrap>
                <div>
                  <SingleText text={answer.text} />
                  <SingleText text={parseTime(answer.createdAt)} />
                </div>
                <CustomActions
                  data={answer}
                  actions={[editAnswerAction, deleteAnswerAction]}
                />
              </Group>
            </Timeline.Item>
          ))}
        </Timeline>
      </Input.Wrapper>
      <TextInput
        label={t('columns.executor')}
        icon={plaint.executorUser && <CustomAvatar {...plaint.executorUser} />}
        iconWidth={48}
        value={plaint.executorUser?.nick || '-'}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        value={plaint.text || '-'}
        autosize
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(plaint.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(plaint.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewPlaintAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.plaints'),
      children: <ViewPlaintModal data={plaint} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
