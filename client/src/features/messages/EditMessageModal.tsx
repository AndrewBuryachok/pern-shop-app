import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Message } from './message.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditMessageMutation } from './messages.api';
import { EditMessageDto } from './message.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Message>;

export default function EditMessageModal({ data: message }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      messageId: message.id,
      text: message.text,
    },
  });

  const [editMessage, { isLoading }] = useEditMessageMutation();

  const handleSubmit = async (dto: EditMessageDto) => {
    await editMessage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.messages')}
      isChanged={!form.isDirty()}
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
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const editMessageAction = {
  open: (message: Message) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.messages'),
      children: <EditMessageModal data={message} />,
    }),
  disable: (message: Message) => {
    const user = getCurrentUser();
    return message.user.id !== user?.id;
  },
  color: Color.YELLOW,
};
