import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import { useCreateTradeMutation } from '../trades/trades.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateTradeDto } from '../trades/trade.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  parseCard,
  parseItem,
  parseThingAmount,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Ware> & { hasRole: boolean };

export default function BuyWareModal({ data: ware, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      wareId: ware.id,
      user: '',
      card: '',
      amount: 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  const maxAmount = card && Math.floor(card.balance / ware.price);

  const [createTrade, { isLoading }] = useCreateTradeMutation();

  const handleSubmit = async (dto: CreateTradeDto) => {
    await createTrade(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.wares')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...ware} />}
        iconWidth={48}
        value={parseItem(ware.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={ware.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(ware)}
        disabled
      />
      <TextInput label={t('columns.price')} value={`${ware.price}$`} disabled />
      {hasRole && (
        <Select
          label={t('columns.user')}
          placeholder={t('columns.user')}
          icon={user && <CustomAvatar {...user} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          disabled={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={customMin(ware.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
    </CustomForm>
  );
}

export const buyWareFactory = (hasRole: boolean) => ({
  open: (ware: Ware) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.wares'),
      children: <BuyWareModal data={ware} hasRole={hasRole} />,
    }),
  disable: () => false,
  color: Color.GREEN,
});

export const buyMyWareAction = buyWareFactory(false);

export const buyUserWareAction = buyWareFactory(true);
