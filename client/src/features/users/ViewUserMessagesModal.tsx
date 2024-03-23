import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useCreateMessageMutation,
  useGetUserMessagesQuery,
} from '../messages/messages.api';
import { CreateMessageDto } from '../messages/message.dto';
import CustomForm from '../../common/components/CustomForm';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import { editMessageAction } from '../messages/EditMessageModal';
import { deleteMessageAction } from '../messages/DeleteMessageModal';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<User>;

export default function ViewUserMessagesModal({ data: user }: Props) {
  const [t] = useTranslation();

  const me = getCurrentUser();

  const form = useForm({
    initialValues: {
      userId: user.id,
      messageId: 0,
      text: '',
    },
  });

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const handleSubmit = async (dto: CreateMessageDto) => {
    await createMessage(dto);
  };

  const response = useGetUserMessagesQuery(user.id);

  const message = response.data?.find(
    (message) => message.id === form.values.messageId,
  );

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      isChanged={!me}
      text={t('actions.create') + ' ' + t('modals.messages')}
    >
      <RepliesTimeline
        {...response}
        actions={[
          {
            open: (reply: Reply) =>
              form.setFieldValue(
                'messageId',
                reply.id === form.values.messageId ? 0 : reply.id,
              ),
            disable: () => false,
            color: Color.GREEN,
          },
          editMessageAction,
          deleteMessageAction,
        ]}
      />
      {message && <ReplyAvatarWithText {...message} />}
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

export const openViewUserMessagesModal = (user: User) =>
  openModal({
    title: t('columns.messages'),
    children: <ViewUserMessagesModal data={user} />,
  });
