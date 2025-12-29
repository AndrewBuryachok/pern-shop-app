import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateStallMutation } from './stalls.api';
import {
  useSelectAllMarketsQuery,
  useSelectMyMarketsQuery,
} from '../markets/markets.api';
import { useSelectMarketTagsQuery } from '../markets-tags/markets-tags.api';
import { CreateStallDto } from './stall.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectMarkets, selectTags } from '../../common/utils';

type Props = { hasRole: boolean };

export default function CreateStallModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      market: '',
      marketTag: '',
      name: '',
    },
    transformValues: ({ marketTag }) => ({ marketTagId: +marketTag }),
  });

  const { data: markets, ...marketsResponse } = hasRole
    ? useSelectAllMarketsQuery()
    : useSelectMyMarketsQuery();
  const { data: marketsTags, ...marketsTagsResponse } =
    useSelectMarketTagsQuery(+form.values.market, {
      skip: !form.values.market,
    });

  const market = markets?.find((market) => market.id === +form.values.market);

  useEffect(
    () => form.setFieldValue('name', market ? `#${market.stalls + 1}` : '-'),
    [form.values.market],
  );

  const [createStall, { isLoading }] = useCreateStallMutation();

  const handleSubmit = async (dto: CreateStallDto) => {
    const data = await createStall(dto);
    if (!('error' in data) && !hasRole) {
      navigate('/stalls/my');
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.stalls')}
    >
      <Select
        label={t('columns.market')}
        placeholder={t('columns.market')}
        rightSection={<RefetchAction {...marketsResponse} />}
        itemComponent={PlacesItem}
        data={selectMarkets(markets)}
        limit={20}
        searchable
        required
        readOnly={marketsResponse.isFetching}
        {...form.getInputProps('market')}
      />
      <Select
        label={t('columns.tag')}
        placeholder={t('columns.tag')}
        rightSection={
          <RefetchAction {...marketsTagsResponse} skip={!form.values.market} />
        }
        data={selectTags(marketsTags)}
        limit={20}
        searchable
        required
        readOnly={marketsTagsResponse.isFetching}
        {...form.getInputProps('marketTag')}
      />
      <TextInput
        label={t('columns.name')}
        readOnly
        {...form.getInputProps('name')}
      />
    </CustomForm>
  );
}

export const createStallFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.stalls'),
      children: <CreateStallModal hasRole={hasRole} />,
    }),
});

export const createMyStallButton = createStallFactory(false);

export const createUserStallButton = createStallFactory(true);
