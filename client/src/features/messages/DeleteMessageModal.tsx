import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Message } from './message.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteMessageMutation } from './messages.api';
import { DeleteMessageDto } from './message.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Message>;

export default function DeleteMessageModal({ data: message }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      messageId: message.id,
    },
  });

  const [deleteMessage, { isLoading }] = useDeleteMessageMutation();

  const handleSubmit = async (dto: DeleteMessageDto) => {
    await deleteMessage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.messages')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...message.user} />}
        iconWidth={48}
        value={message.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        value={message.text}
        autosize
        readOnly
      />
    </CustomForm>
  );
}

export const deleteMessageAction = {
  open: (message: Message) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.messages'),
      children: <DeleteMessageModal data={message} />,
    }),
  disable: (message: Message) => {
    const user = getCurrentUser();
    return message.user.id !== user?.id;
  },
  color: Color.RED,
};
