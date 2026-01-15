import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Tabs } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  IconArrowsRightLeft,
  IconCashBanknote,
  IconCashBanknoteOff,
} from '@tabler/icons';
import {
  useCreateDepositMutation,
  useCreateWithdrawMutation,
} from './transactions.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { useSelectUserCardsWithBalanceQuery } from '../cards/cards.api';
import { CreateTransactionDto } from './transaction.dto';
import CreateTransferModal from './CreateTransferModal';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { MAX_SUM_VALUE } from '../../common/constants';

type Props = { type: boolean };

export default function CreateTransactionModal({ type }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      sum: 1,
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
    validate: {
      card: (_, values) =>
        !type && myCard.balance < values.sum
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: cards, ...cardsResponse } = useSelectUserCardsWithBalanceQuery(
    +form.values.user,
    { skip: !form.values.user },
  );

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  myCard.balance = card?.account.balance || 0;
  const maxSum = !type ? card?.account.balance : undefined;

  const [createDeposit, { isLoading: isDepositLoading }] =
    useCreateDepositMutation();
  const [createWithdraw, { isLoading: isWithdrawLoading }] =
    useCreateWithdrawMutation();

  const handleSubmit = async (dto: CreateTransactionDto) => {
    if (type) {
      await createDeposit(dto);
    } else {
      await createWithdraw(dto);
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isDepositLoading || isWithdrawLoading}
      text={t('actions.create') + ' ' + t('modals.transactions')}
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
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        description={`${
          type ? t('information.increase') : t('information.decrease')
        } ${form.values.sum} ${t('constants.currency')}`}
        rightSection={
          <RefetchAction {...cardsResponse} skip={!form.values.user} />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        readOnly={cardsResponse.isFetching}
        {...form.getInputProps('card')}
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

function CreateTransactionModalWithTabs() {
  const [t] = useTranslation();

  const tabs = [
    { value: 'deposit', icon: <IconCashBanknote size={16} /> },
    { value: 'withdraw', icon: <IconCashBanknoteOff size={16} /> },
    { value: 'transfer', icon: <IconArrowsRightLeft size={16} /> },
  ];

  return (
    <Tabs defaultValue={tabs[0].value}>
      <Tabs.List grow>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value} icon={tab.icon}>
            {t(`actions.${tab.value}`)}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab, index) => (
        <Tabs.Panel value={tab.value}>
          {tab.value === 'transfer' ? (
            <CreateTransferModal hasRole={true} />
          ) : (
            <CreateTransactionModal type={!index} />
          )}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export const createTransactionButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.transactions'),
      children: <CreateTransactionModalWithTabs />,
    }),
};
