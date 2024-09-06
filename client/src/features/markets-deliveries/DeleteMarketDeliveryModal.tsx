import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import { useDeleteMarketDeliveryMutation } from './markets-deliveries.api';
import { MarketDeliveryIdDto } from './market-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseTradeAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<MarketDelivery>;

export default function DeleteMarketDeliveryModal({
  data: marketDelivery,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      marketDeliveryId: marketDelivery.id,
    },
  });

  const [deleteMarketDelivery, { isLoading }] =
    useDeleteMarketDeliveryMutation();

  const handleSubmit = async (dto: MarketDeliveryIdDto) => {
    await deleteMarketDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        description={`${t('information.increase')} ${marketDelivery.price} ${t(
          'constants.currency',
        )}`}
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
      <TextInput
        label={t('columns.price')}
        value={`${marketDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteMarketDeliveryAction = {
  open: (marketDelivery: MarketDelivery) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.deliveries'),
      children: <DeleteMarketDeliveryModal data={marketDelivery} />,
    }),
  disable: (marketDelivery: MarketDelivery) =>
    marketDelivery.status !== Status.CREATED,
  color: Color.RED,
};
