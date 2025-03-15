import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateExchangeMutation } from './exchanges.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateExchangeDto } from './exchange.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import { ColorsItem } from '../../common/components/ColorsItem';
import {
  customMin,
  selectCardsWithBalance,
  selectExchangeTypes,
  selectUsers,
} from '../../common/utils';
import { MAX_SUM_VALUE } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateExchangeModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      type: '',
      sum: 1,
    },
    transformValues: ({ user, card, type, ...rest }) => ({
      ...rest,
      cardId: +card,
      type: !!+type,
    }),
    validate: {
      card: (_, values) =>
        !+values.type && myCard.balance < values.sum
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

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
  myCard.balance = card?.account.balance || 0;
  const maxSum = !+form.values.type ? card?.account.balance : undefined;

  const [createExchange, { isLoading }] = useCreateExchangeMutation();

  const handleSubmit = async (dto: CreateExchangeDto) => {
    await createExchange(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.exchanges')}
    >
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
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        description={`${
          !!+form.values.type
            ? t('information.increase')
            : t('information.decrease')
        } ${form.values.sum} ${t('constants.currency')}`}
        rightSection={
          <RefetchAction
            {...cardsResponse}
            skip={!form.values.user && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        readOnly={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
      <Select
        label={t('columns.type')}
        placeholder={t('columns.type')}
        itemComponent={ColorsItem}
        data={selectExchangeTypes()}
        searchable
        required
        {...form.getInputProps('type')}
      />
      <NumberInput
        label={t('columns.sum')}
        placeholder={t('columns.sum')}
        required
        min={1}
        max={customMin(MAX_SUM_VALUE, maxSum)}
        {...form.getInputProps('sum')}
      />
    </CustomForm>
  );
}

export const createExchangeFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.exchanges'),
      children: <CreateExchangeModal hasRole={hasRole} />,
    }),
});

export const createMyExchangeButton = createExchangeFactory(false);

export const createUserExchangeButton = createExchangeFactory(true);
