import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Advert } from './advert.model';
import { useRespondAdvertMutation } from './adverts.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { RespondAdvertDto } from './advert.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  parseCard,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import {
  Color,
  MAX_ACTIVITY_LENGTH,
  MAX_PRICE_VALUE,
  MAX_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Advert> & { hasRole: boolean };

export default function RespondAdvertModal({ data: advert, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      advertId: advert.id,
      user: '',
      card: '',
      activity: advert.activity,
      text: advert.text,
      price: advert.price,
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

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [respondAdvert, { isLoading }] = useRespondAdvertMutation();

  const handleSubmit = async (dto: RespondAdvertDto) => {
    await respondAdvert(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.respond') + ' ' + t('modals.adverts')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...advert.card.user} />}
        iconWidth={48}
        value={parseCard(advert.card)}
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
      <Textarea
        label={t('columns.activity')}
        placeholder={t('columns.activity')}
        required
        maxLength={MAX_ACTIVITY_LENGTH}
        {...form.getInputProps('activity')}
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={customMin(MAX_PRICE_VALUE, myCard.balance)}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const respondAdvertFactory = (hasRole: boolean) => ({
  open: (advert: Advert) =>
    openModal({
      title: t('actions.respond') + ' ' + t('modals.adverts'),
      children: <RespondAdvertModal data={advert} hasRole={hasRole} />,
    }),
  disable: () => false,
  color: Color.GREEN,
});

export const respondMyAdvertAction = respondAdvertFactory(false);

export const respondUserAdvertAction = respondAdvertFactory(true);
