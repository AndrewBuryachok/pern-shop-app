import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import { useContinueRentMutation } from './rents.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { RentIdDto } from './rent.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseStore,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rent> & { hasRole: boolean };

export default function ContinueRentModal({ data: rent, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      rentId: rent.id,
      card: `${rent.card.id}`,
    },
    validate: {
      card: () =>
        myCard.balance < rent.store.market.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(rent.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [continueRent, { isLoading }] = useContinueRentMutation();

  const handleSubmit = async (dto: RentIdDto) => {
    await continueRent(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.continue') + ' ' + t('modals.rents')}
    >
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...rent.card.user} />}
        iconWidth={48}
        value={parseCard(rent.card)}
        disabled
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        readOnly
        {...form.getInputProps('card')}
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(rent.store.market.card)}
        disabled
      />
      <TextInput
        label={t('columns.storage')}
        value={parseStore(rent.store)}
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${rent.store.market.price} ${t('constants.currency')}`}
        disabled
      />
    </CustomForm>
  );
}

export const continueRentFactory = (hasRole: boolean) => ({
  open: (rent: Rent) =>
    openModal({
      title: t('actions.continue') + ' ' + t('modals.rents'),
      children: <ContinueRentModal data={rent} hasRole={hasRole} />,
    }),
  disable: (rent: Rent) => rent.completedAt > new Date(),
  color: Color.GREEN,
});

export const continueMyRentAction = continueRentFactory(false);

export const continueUserRentAction = continueRentFactory(true);
