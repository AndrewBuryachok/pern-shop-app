import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Trade } from './trade.model';
import { useRateTradeMutation } from './trades.api';
import { RateTradeDto } from './trade.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseTradeAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Trade>;

export default function RateTradeModal({ data: trade }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      tradeId: trade.id,
      rate: 5,
    },
  });

  const [rateTrade, { isLoading }] = useRateTradeMutation();

  const handleSubmit = async (dto: RateTradeDto) => {
    await rateTrade(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.trades')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...trade.ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(trade.ware.rent.card)}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateTradeAction = {
  open: (trade: Trade) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.trades'),
      children: <RateTradeModal data={trade} />,
    }),
  disable: (trade: Trade) => !!trade.rate,
  color: Color.YELLOW,
};
