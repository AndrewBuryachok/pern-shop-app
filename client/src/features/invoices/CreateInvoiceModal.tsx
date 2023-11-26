import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateInvoiceMutation } from './invoices.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { CreateInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import { selectCardsWithBalance, selectUsers } from '../../common/utils';
import { MAX_DESCRIPTION_LENGTH, MAX_SUM_VALUE } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateInvoiceModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      senderUser: '',
      senderCard: '',
      receiverUser: '',
      sum: 1,
      description: '-',
    },
    transformValues: ({ senderCard, receiverUser, ...rest }) => ({
      ...rest,
      senderCardId: +senderCard,
      receiverUserId: +receiverUser,
    }),
  });

  useEffect(
    () => form.setFieldValue('senderCard', ''),
    [form.values.senderUser],
  );

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.senderUser, {
        skip: !form.values.senderUser,
      })
    : useSelectMyCardsQuery();

  const senderUser = users?.find((user) => user.id === +form.values.senderUser);
  const receiverUser = users?.find(
    (user) => user.id === +form.values.receiverUser,
  );

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

  const handleSubmit = async (dto: CreateInvoiceDto) => {
    await createInvoice(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.invoice')}
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
            {...cardsResponse}
            skip={!form.values.senderUser && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        disabled={cardsResponse.isFetching}
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
      <NumberInput
        label={t('columns.sum')}
        placeholder={t('columns.sum')}
        required
        min={1}
        max={MAX_SUM_VALUE}
        {...form.getInputProps('sum')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createInvoiceFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.invoice'),
      children: <CreateInvoiceModal hasRole={hasRole} />,
    }),
});

export const createMyInvoiceButton = createInvoiceFactory(false);

export const createUserInvoiceButton = createInvoiceFactory(true);
