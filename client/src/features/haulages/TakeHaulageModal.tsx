import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import { useTakeHaulageMutation } from './haulages.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { TakeHaulageDto } from './haulage.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseItem,
  parseThingAmount,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Haulage> & { hasRole: boolean };

export default function TakeHaulageModal({ data: haulage, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      haulageId: haulage.id,
      user: '',
      card: '',
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
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

  const [takeHaulage, { isLoading }] = useTakeHaulageMutation();

  const handleSubmit = async (dto: TakeHaulageDto) => {
    await takeHaulage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.haulages')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...haulage.fromHire.card.user} />}
        iconWidth={48}
        value={parseCard(haulage.fromHire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...haulage} />}
        iconWidth={48}
        value={parseItem(haulage.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={haulage.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(haulage)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${haulage.price} ${t('constants.currency')}`}
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

export const takeHaulageFactory = (hasRole: boolean) => ({
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.haulages'),
      children: <TakeHaulageModal data={haulage} hasRole={hasRole} />,
    }),
  disable: (haulage: Haulage) => haulage.status !== Status.CREATED,
  color: Color.GREEN,
});

export const takeMyHaulageAction = takeHaulageFactory(false);

export const takeUserHaulageAction = takeHaulageFactory(true);
