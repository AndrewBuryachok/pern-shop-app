import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import { useContinueRentMutation } from './rents.api';
import { useSelectStoreTagQuery } from '../stores/stores.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { RentIdDto } from './rent.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
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

  const { data: tag, ...tagResponse } = useSelectStoreTagQuery(rent.store.id);

  const form = useForm({
    initialValues: {
      rentId: rent.id,
      card: `${rent.card.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: () =>
        !tag || myCard.balance < tag.price
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
        label={t('columns.tenant')}
        icon={<CustomAvatar {...rent.card.user} />}
        iconWidth={48}
        value={parseCard(rent.card)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(rent.store.market.card)}
        readOnly
      />
      <TextInput
        label={t('columns.market')}
        value={parseStore(rent.store)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${tag?.price || '-'} ${t('constants.currency')}`}
        rightSection={<RefetchAction {...tagResponse} />}
        readOnly
      />
      <Select
        label={t('columns.card')}
        description={`${t('information.decrease')} ${tag?.price || 0} ${t(
          'constants.currency',
        )}`}
        rightSection={<RefetchAction {...cardsResponse} />}
        data={selectCardsWithBalance(cards)}
        readOnly
        {...form.getInputProps('card')}
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
  disable: (rent: Rent) => new Date(rent.completedAt) < new Date(),
  color: Color.GREEN,
});

export const continueMyRentAction = continueRentFactory(false);

export const continueUserRentAction = continueRentFactory(true);
