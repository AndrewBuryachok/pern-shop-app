import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateExchangeMutation } from './exchanges.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { useSelectUserCardsWithBalanceQuery } from '../cards/cards.api';
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

export default function CreateExchangeModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      type: '',
      sum: 1,
    },
    transformValues: ({ user, card, type, ...rest }) => ({
      ...rest,
      type: !!+type,
      userId: +user,
      cardId: +card,
    }),
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: cards, ...cardsResponse } = useSelectUserCardsWithBalanceQuery(
    +form.values.user,
    { skip: !form.values.user },
  );

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  const maxSum = !+form.values.type ? card?.balance : undefined;

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
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={
          <RefetchAction {...cardsResponse} skip={!form.values.user} />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        disabled={cardsResponse.isFetching}
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

export const createExchangeButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.exchanges'),
      children: <CreateExchangeModal />,
    }),
};
