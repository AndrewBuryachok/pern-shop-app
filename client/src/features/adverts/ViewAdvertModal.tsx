import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Advert } from './advert.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Advert>;

export default function ViewAdvertModal({ data: advert }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={advert.id} readOnly />
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...advert.card.user} />}
        iconWidth={48}
        value={parseCard(advert.card)}
        readOnly
      />
      <Textarea
        label={t('columns.activity')}
        value={advert.activity}
        readOnly
      />
      <Textarea label={t('columns.text')} value={advert.text} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${advert.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(advert.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewAdvertAction = {
  open: (advert: Advert) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.adverts'),
      children: <ViewAdvertModal data={advert} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
