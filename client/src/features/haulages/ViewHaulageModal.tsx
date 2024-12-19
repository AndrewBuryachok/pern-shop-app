import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBox,
  parseCard,
  parseItem,
  parseStatus,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Haulage>;

export default function ViewHaulageModal({ data: haulage }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={haulage.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...haulage.fromHire.card.user} />}
        iconWidth={48}
        value={parseCard(haulage.fromHire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...haulage} />}
        iconWidth={48}
        value={parseItem(haulage.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={haulage.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(haulage)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${haulage.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(haulage.status)}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={
          haulage.executorCard && (
            <CustomAvatar {...haulage.executorCard.user} />
          )
        }
        iconWidth={48}
        value={haulage.executorCard ? parseCard(haulage.executorCard) : '-'}
        readOnly
      />
      <TextInput
        label={t('columns.fromStation')}
        value={parseBox(haulage.fromHire.box)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...haulage.fromHire.box.station.card.user} />}
        iconWidth={48}
        value={parseCard(haulage.fromHire.box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.toStation')}
        value={parseBox(haulage.toHire.box)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...haulage.toHire.box.station.card.user} />}
        iconWidth={48}
        value={parseCard(haulage.toHire.box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(haulage.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(haulage.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={haulage.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewHaulageAction = {
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.haulages'),
      children: <ViewHaulageModal data={haulage} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
