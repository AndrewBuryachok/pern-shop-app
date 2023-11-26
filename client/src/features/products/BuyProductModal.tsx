import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import { useCreateSaleMutation } from '../sales/sales.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateSaleDto } from '../sales/sale.dto';
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

type Props = IModal<Product> & { hasRole: boolean };

export default function BuyProductModal({ data: product, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      productId: product.id,
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
  const maxAmount = card && Math.floor(card.balance / product.price);

  const [createSale, { isLoading }] = useCreateSaleMutation();

  const handleSubmit = async (dto: CreateSaleDto) => {
    await createSale(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.product')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...product} />}
        iconWidth={48}
        value={parseItem(product.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={product.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(product)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${product.price}$`}
        disabled
      />
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
        max={customMin(product.amount, maxAmount)}
        {...form.getInputProps('amount')}
      />
    </CustomForm>
  );
}

export const buyProductFactory = (hasRole: boolean) => ({
  open: (product: Product) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.product'),
      children: <BuyProductModal data={product} hasRole={hasRole} />,
    }),
  disable: () => false,
  color: Color.GREEN,
});

export const buyMyProductAction = buyProductFactory(false);

export const buyUserProductAction = buyProductFactory(true);
