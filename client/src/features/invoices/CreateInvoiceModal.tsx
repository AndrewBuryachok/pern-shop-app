import { useEffect } from 'react';
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
      text={'Create invoice'}
    >
      {hasRole && (
        <Select
          label='Sender User'
          placeholder='Sender User'
          icon={senderUser && <CustomAvatar {...senderUser} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          searchable
          required
          disabled={usersResponse.isFetching}
          {...form.getInputProps('senderUser')}
        />
      )}
      <Select
        label='Sender Card'
        placeholder='Sender Card'
        rightSection={
          <RefetchAction
            {...cardsResponse}
            skip={!form.values.senderUser && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('senderCard')}
      />
      <Select
        label='Receiver User'
        placeholder='Receiver User'
        icon={receiverUser && <CustomAvatar {...receiverUser} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('receiverUser')}
      />
      <NumberInput
        label='Sum'
        placeholder='Sum'
        required
        min={1}
        max={MAX_SUM_VALUE}
        {...form.getInputProps('sum')}
      />
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createInvoiceFactory = (hasRole: boolean) => ({
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Invoice',
      children: <CreateInvoiceModal hasRole={hasRole} />,
    }),
});

export const createMyInvoiceButton = createInvoiceFactory(false);

export const createUserInvoiceButton = createInvoiceFactory(true);
