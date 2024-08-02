import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Trade } from './trade.model';
import { useDeleteTradeMutation } from './trades.api';
import { DeleteTradeDto } from './trade.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseTradeAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Trade>;

export default function DeleteTradeModal({ data: trade }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      tradeId: trade.id,
    },
  });

  const [deleteTrade, { isLoading }] = useDeleteTradeMutation();

  const handleSubmit = async (dto: DeleteTradeDto) => {
    await deleteTrade(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.trades')}
    >
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...trade.card.user} />}
        iconWidth={48}
        value={parseCard(trade.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...trade.ware} />}
        iconWidth={48}
        value={parseItem(trade.ware.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={trade.ware.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseTradeAmount(trade)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${trade.amount * trade.ware.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteTradeAction = {
  open: (trade: Trade) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.trades'),
      children: <DeleteTradeModal data={trade} />,
    }),
  disable: () => false,
  color: Color.RED,
};
