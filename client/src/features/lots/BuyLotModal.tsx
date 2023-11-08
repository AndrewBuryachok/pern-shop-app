import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import { useCreateBidMutation } from '../bids/bids.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateBidDto } from '../bids/bid.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  parseCard,
  parseCell,
  parseItem,
  parseThingAmount,
  selectCardsWithBalance,
  viewStates,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE } from '../../common/constants';

type Props = IModal<Lot>;

export default function BuyLotModal({ data: lot }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      lotId: lot.id,
      card: '',
      price: lot.price + 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  const card = cards?.find((card) => card.id === +form.values.card);
  const maxPrice = card?.balance;

  const [createBid, { isLoading }] = useCreateBidMutation();

  const handleSubmit = async (dto: CreateBidDto) => {
    await createBid(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.lot')}
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
      <Select
        label={t('columns.bids')}
        placeholder={`${t('components.total')}: ${lot.bids.length}`}
        itemComponent={StatesItem}
        data={viewStates(lot.bids)}
        searchable
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(lot.lease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.cell.storage.card)}
        disabled
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={lot.price + 1}
        max={customMin(MAX_PRICE_VALUE, maxPrice)}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const buyLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.lot'),
      children: <BuyLotModal data={lot} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
