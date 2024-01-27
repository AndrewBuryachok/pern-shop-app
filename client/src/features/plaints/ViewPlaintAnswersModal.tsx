import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateAnswerMutation } from '../answers/answers.api';
import { useSelectPlaintAnswersQuery } from './plaints.api';
import { CreateAnswerDto } from '../answers/answer.dto';
import CustomForm from '../../common/components/CustomForm';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import { editAnswerAction } from '../answers/EditAnswerModal';
import { deleteAnswerAction } from '../answers/DeleteAnswerModal';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Plaint>;

export default function ViewPlaintAnswersModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
      answerId: 0,
      text: '',
    },
  });

  const [createAnswer, { isLoading }] = useCreateAnswerMutation();

  const handleSubmit = async (dto: CreateAnswerDto) => {
    await createAnswer(dto);
  };

  const response = useSelectPlaintAnswersQuery(plaint.id);

  const answer = response.data?.find(
    (answer) => answer.id === form.values.answerId,
  );

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      isChanged={!user}
      text={t('actions.create') + ' ' + t('modals.answers')}
    >
      <RepliesTimeline
        {...response}
        actions={[
          {
            open: (reply: Reply) =>
              form.setFieldValue(
                'answerId',
                reply.id === form.values.answerId ? 0 : reply.id,
              ),
            disable: () => false,
            color: Color.GREEN,
          },
          editAnswerAction,
          deleteAnswerAction,
        ]}
      />
      {answer && <ReplyAvatarWithText {...answer} />}
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

export const openViewPlaintAnswersModal = (plaint: Plaint) =>
  openModal({
    title: t('columns.answers'),
    children: <ViewPlaintAnswersModal data={plaint} />,
  });
