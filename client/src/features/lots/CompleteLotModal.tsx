import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import { useCompleteLotMutation } from './lots.api';
import { CompleteLotDto } from './lot.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lot>;

export default function CompleteLotModal({ data: lot }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      lotId: lot.id,
    },
  });

  const [completeLot, { isLoading }] = useCompleteLotMutation();

  const handleSubmit = async (dto: CompleteLotDto) => {
    await completeLot(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.lot')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={parseItem(lot.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={lot.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(lot)}
        disabled
      />
      <TextInput label={t('columns.price')} value={`${lot.price}$`} disabled />
    </CustomForm>
  );
}

export const completeLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.lot'),
      children: <CompleteLotModal data={lot} />,
    }),
  disable: (lot: Lot) => !!lot.completedAt,
  color: Color.GREEN,
};
