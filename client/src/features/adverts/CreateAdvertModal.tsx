import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateAdvertMutation } from './adverts.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateAdvertDto } from './advert.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import { selectCardsWithBalance, selectUsers } from '../../common/utils';
import {
  MAX_ACTIVITY_LENGTH,
  MAX_PRICE_VALUE,
  MAX_TEXT_LENGTH,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateAdvertModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      activity: '',
      text: '',
      price: 1,
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

  const [createAdvert, { isLoading }] = useCreateAdvertMutation();

  const handleSubmit = async (dto: CreateAdvertDto) => {
    await createAdvert(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.adverts')}
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
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createAdvertFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.adverts'),
      children: <CreateAdvertModal hasRole={hasRole} />,
    }),
});

export const createMyAdvertButton = createAdvertFactory(false);

export const createUserAdvertButton = createAdvertFactory(true);
