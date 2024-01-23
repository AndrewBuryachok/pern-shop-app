import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from '../users/user.model';
import { useRemoveSubscriberMutation } from './subscribers.api';
import { UpdateSubscriberDto } from './subscriber.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function RemoveSubscriberModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [removeSubscriber, { isLoading }] = useRemoveSubscriberMutation();

  const handleSubmit = async (dto: UpdateSubscriberDto) => {
    await removeSubscriber(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.subscribers')}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        readOnly
      />
    </CustomForm>
  );
}

export const removeSubscriberAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.subscribers'),
      children: <RemoveSubscriberModal data={user} />,
    }),
  disable: () => false,
  color: Color.RED,
};
