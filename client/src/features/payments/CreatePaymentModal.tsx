import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePaymentMutation } from './payments.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreatePaymentDto } from './payment.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  selectCards,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { MAX_DESCRIPTION_LENGTH, MAX_SUM_VALUE } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreatePaymentModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      senderUser: '',
      senderCard: '',
      receiverUser: '',
      receiverCard: '',
      sum: 1,
      description: '',
    },
    transformValues: ({ senderCard, receiverCard, ...rest }) => ({
      ...rest,
      senderCardId: +senderCard,
      receiverCardId: +receiverCard,
    }),
  });

  useEffect(
    () => form.setFieldValue('senderCard', ''),
    [form.values.senderUser],
  );

  useEffect(
    () => form.setFieldValue('receiverCard', ''),
    [form.values.receiverUser],
  );

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: senderCards, ...senderCardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.senderUser, {
        skip: !form.values.senderUser,
      })
    : useSelectMyCardsQuery();
  const { data: receiverCards, ...receiverCardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.receiverUser, {
        skip: !form.values.receiverUser,
      })
    : useSelectUserCardsQuery(+form.values.receiverUser, {
        skip: !form.values.receiverUser,
      });

  const senderUser = users?.find((user) => user.id === +form.values.senderUser);
  const receiverUser = users?.find(
    (user) => user.id === +form.values.receiverUser,
  );
  const card = senderCards?.find((card) => card.id === +form.values.senderCard);
  const maxSum = card?.balance;

  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handleSubmit = async (dto: CreatePaymentDto) => {
    await createPayment(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.payments')}
    >
      {hasRole && (
        <Select
          label={t('columns.sender')}
          placeholder={t('columns.sender')}
          icon={senderUser && <CustomAvatar {...senderUser} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          disabled={usersResponse.isFetching}
          {...form.getInputProps('senderUser')}
        />
      )}
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={
          <RefetchAction
            {...senderCardsResponse}
            skip={!form.values.senderUser && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(senderCards)}
        limit={20}
        searchable
        required
        disabled={senderCardsResponse.isFetching}
        {...form.getInputProps('senderCard')}
      />
      <Select
        label={t('columns.receiver')}
        placeholder={t('columns.receiver')}
        icon={receiverUser && <CustomAvatar {...receiverUser} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        limit={20}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('receiverUser')}
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={
          <RefetchAction
            {...receiverCardsResponse}
            skip={!form.values.receiverUser}
          />
        }
        itemComponent={CardsItem}
        data={selectCards(receiverCards)}
        limit={20}
        searchable
        required
        disabled={receiverCardsResponse.isFetching}
        {...form.getInputProps('receiverCard')}
      />
      <NumberInput
        label={t('columns.sum')}
        placeholder={t('columns.sum')}
        required
        min={1}
        max={customMin(MAX_SUM_VALUE, maxSum)}
        {...form.getInputProps('sum')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createPaymentFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.payments'),
      children: <CreatePaymentModal hasRole={hasRole} />,
    }),
});

export const createMyPaymentButton = createPaymentFactory(false);

export const createUserPaymentButton = createPaymentFactory(true);
