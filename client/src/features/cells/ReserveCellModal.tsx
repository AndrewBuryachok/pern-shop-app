import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Cell } from './cell.model';
import { useCreateLeaseMutation } from '../leases/leases.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateLeaseDto } from '../leases/lease.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseCell,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Cell> & { hasRole: boolean };

export default function ReserveCellModal({ data: cell, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      cellId: cell.id,
      user: '',
      card: '',
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
    validate: {
      card: () =>
        myCard.balance < cell.storageTag.price
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

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createLease, { isLoading }] = useCreateLeaseMutation();

  const handleSubmit = async (dto: CreateLeaseDto) => {
    await createLease(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.reserve') + ' ' + t('modals.cells')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(cell.storage.card)}
        readOnly
      />
      <TextInput label={t('columns.cell')} value={parseCell(cell)} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${cell.storageTag.price} ${t('constants.currency')}`}
        readOnly
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
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
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
    </CustomForm>
  );
}

export const reserveCellFactory = (hasRole: boolean) => ({
  open: (cell: Cell) =>
    openModal({
      title: t('actions.reserve') + ' ' + t('modals.cells'),
      children: <ReserveCellModal data={cell} hasRole={hasRole} />,
    }),
  disable: () => false,
  color: Color.GREEN,
});

export const reserveMyCellAction = reserveCellFactory(false);

export const reserveUserCellAction = reserveCellFactory(true);
