import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import { useRateMarketDeliveryMutation } from './markets-deliveries.api';
import { RateMarketDeliveryDto } from './market-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseTradeAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<MarketDelivery>;

export default function RateMarketDeliveryModal({
  data: marketDelivery,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      marketDeliveryId: marketDelivery.id,
      rate: 5,
    },
  });

  const [rateMarketDelivery, { isLoading }] = useRateMarketDeliveryMutation();

  const handleSubmit = async (dto: RateMarketDeliveryDto) => {
    await rateMarketDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...marketDelivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(marketDelivery.executorCard!)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...marketDelivery.trade.ware} />}
        iconWidth={48}
        value={parseItem(marketDelivery.trade.ware.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={marketDelivery.trade.ware.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseTradeAmount(marketDelivery.trade)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${marketDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateMarketDeliveryAction = {
  open: (marketDelivery: MarketDelivery) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.deliveries'),
      children: <RateMarketDeliveryModal data={marketDelivery} />,
    }),
  disable: (marketDelivery: MarketDelivery) =>
    marketDelivery.status !== Status.COMPLETED || !!marketDelivery.rate,
  color: Color.YELLOW,
};
