import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateStoreMutation } from './stores.api';
import {
  useSelectAllMarketsQuery,
  useSelectMyMarketsQuery,
} from '../markets/markets.api';
import { CreateStoreDto } from './store.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectMarkets } from '../../common/utils';

type Props = { hasRole: boolean };

export default function CreateStoreModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      market: '',
      name: '',
    },
    transformValues: ({ market, ...rest }) => ({
      ...rest,
      marketId: +market,
    }),
  });

  const { data: markets, ...marketsResponse } = hasRole
    ? useSelectAllMarketsQuery()
    : useSelectMyMarketsQuery();

  const market = markets?.find((market) => market.id === +form.values.market);

  useEffect(
    () => form.setFieldValue('name', market ? `#${market.stores + 1}` : ''),
    [form.values.market],
  );

  const [createStore, { isLoading }] = useCreateStoreMutation();

  const handleSubmit = async (dto: CreateStoreDto) => {
    await createStore(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.store')}
    >
      <Select
        label={t('columns.market')}
        placeholder={t('columns.market')}
        rightSection={<RefetchAction {...marketsResponse} />}
        itemComponent={PlacesItem}
        data={selectMarkets(markets)}
        searchable
        required
        disabled={marketsResponse.isFetching}
        {...form.getInputProps('market')}
      />
      <TextInput
        label={t('columns.name')}
        disabled
        {...form.getInputProps('name')}
      />
    </CustomForm>
  );
}

export const createStoreFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.store'),
      children: <CreateStoreModal hasRole={hasRole} />,
    }),
});

export const createMyStoreButton = createStoreFactory(false);

export const createUserStoreButton = createStoreFactory(true);
