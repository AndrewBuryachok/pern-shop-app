import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Plaint>;

export default function ViewPlaintModal({ data: plaint }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={plaint.id} disabled />
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...plaint.senderUser} />}
        iconWidth={48}
        value={plaint.senderUser.name}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={plaint.senderDescription}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...plaint.receiverUser} />}
        iconWidth={48}
        value={plaint.receiverUser.name}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={plaint.receiverDescription || '-'}
        disabled
      />
      <TextInput
        label={t('columns.executor')}
        icon={plaint.executorUser && <CustomAvatar {...plaint.executorUser} />}
        iconWidth={48}
        value={plaint.executorUser ? plaint.executorUser.name : '-'}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={plaint.executorDescription || '-'}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(plaint.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.executed')}
        value={parseTime(plaint.executedAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(plaint.completedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewPlaintAction = {
  open: (plaint: Plaint) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.plaint'),
      children: <ViewPlaintModal data={plaint} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
