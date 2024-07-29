import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import { useEditMarketDeliveryMutation } from './markets-deliveries.api';
import { EditMarketDeliveryDto } from './market-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseTradeAmount } from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<MarketDelivery>;

export default function EditMarketDeliveryModal({
  data: marketDelivery,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      marketDeliveryId: marketDelivery.id,
      price: marketDelivery.price,
    },
  });

  const [editMarketDelivery, { isLoading }] = useEditMarketDeliveryMutation();

  const handleSubmit = async (dto: EditMarketDeliveryDto) => {
    await editMarketDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.deliveries')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...marketDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(marketDelivery.hire.card)}
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
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editMarketDeliveryAction = {
  open: (marketDelivery: MarketDelivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: <EditMarketDeliveryModal data={marketDelivery} />,
    }),
  disable: (marketDelivery: MarketDelivery) =>
    marketDelivery.status !== Status.CREATED,
  color: Color.YELLOW,
};
