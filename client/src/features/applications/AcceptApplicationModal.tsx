import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from '../users/user.model';
import { useAcceptApplicationMutation } from './applications.api';
import { UserIdDto } from '../users/user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function AcceptApplicationModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [cancelApplication, { isLoading }] = useAcceptApplicationMutation();

  const handleSubmit = async (dto: UserIdDto) => {
    await cancelApplication(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.accept') + ' ' + t('modals.applications')}
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

export const acceptApplicationAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.accept') + ' ' + t('modals.applications'),
      children: <AcceptApplicationModal data={user} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
