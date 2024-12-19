import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Hire } from './hire.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseBox, parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Hire>;

export default function ViewHireModal({ data: hire }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={hire.id} readOnly />
      <TextInput
        label={t('columns.tenant')}
        icon={<CustomAvatar {...hire.card.user} />}
        iconWidth={48}
        value={parseCard(hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...hire.box.station.card.user} />}
        iconWidth={48}
        value={parseCard(hire.box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parseBox(hire.box)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${hire.sum} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(hire.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(hire.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewHireAction = {
  open: (hire: Hire) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.hires'),
      children: <ViewHireModal data={hire} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
