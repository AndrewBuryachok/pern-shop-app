import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from './town.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Town>;

export default function ViewTownModal({ data: town }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={town.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...town.user} />}
        iconWidth={48}
        value={town.user.nick}
        readOnly
      />
      <TextInput label={t('columns.town')} value={town.name} readOnly />
      <Textarea
        label={t('columns.description')}
        value={town.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={town.x} readOnly />
      <TextInput label={t('columns.y')} value={town.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(town.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewTownAction = {
  open: (town: Town) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.towns'),
      children: <ViewTownModal data={town} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
