import { useTranslation } from 'react-i18next';
import { ActionIcon, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateAnswerMutation } from '../answers/answers.api';
import { useSelectPlaintAnswersQuery } from './plaints.api';
import { CreateAnswerDto } from '../answers/answer.dto';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import ReplyAvatarWithClose from '../../common/components/ReplyAvatarWithClose';
import CustomAnchor from '../../common/components/CustomAnchor';
import { editAnswerAction } from '../answers/EditAnswerModal';
import { deleteAnswerAction } from '../answers/DeleteAnswerModal';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Plaint>;

export default function ViewPlaintAnswersModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      plaintId: plaint.id,
      answerId: 0,
      text: '',
    },
  });

  const user = getCurrentUser();

  const [createAnswer, { isLoading }] = useCreateAnswerMutation();

  const handleSubmit = async (dto: CreateAnswerDto) => {
    await createAnswer(dto);
    form.reset();
  };

  const response = useSelectPlaintAnswersQuery(plaint.id, { skip: !opened });

  const answer = response.data?.find(
    (answer) => answer.id === form.values.answerId,
  );

  return (
    <>
      {opened ? (
        <RepliesTimeline
          {...response}
          actions={[editAnswerAction, deleteAnswerAction]}
          reply={(reply: Reply) => form.setFieldValue('answerId', reply.id)}
        />
      ) : (
        plaint.answer && <ReplyAvatarWithText {...plaint.answer} />
      )}
      {!!plaint.answers && (
        <CustomAnchor
          text={
            (opened ? t('actions.hide') : t('actions.view')) +
            ' ' +
            t('pages.all').toLowerCase() +
            ' ' +
            t('columns.answers').toLowerCase()
          }
          open={toggle}
        />
      )}
      {answer && (
        <ReplyAvatarWithClose
          {...answer}
          close={() => form.setFieldValue('answerId', 0)}
        />
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          placeholder={t('columns.reply')}
          rightSection={
            <ActionIcon size={24} type='submit' disabled={!user || isLoading}>
              <IconSend size={16} />
            </ActionIcon>
          }
          required
          autosize
          maxLength={MAX_TEXT_LENGTH}
          {...form.getInputProps('text')}
        />
      </form>
    </>
  );
}
