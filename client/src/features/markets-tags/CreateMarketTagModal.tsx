import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateMarketTagMutation } from './markets-tags.api';
import {
  useSelectAllMarketsQuery,
  useSelectMyMarketsQuery,
} from '../markets/markets.api';
import { CreateMarketTagDto } from './market-tag.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectMarkets } from '../../common/utils';
import {
  MAX_NAME_LENGTH,
  MAX_PRICE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateMarketTagModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      market: '',
      name: '',
      price: 1,
    },
    transformValues: ({ market, ...rest }) => ({ ...rest, marketId: +market }),
  });

  const { data: markets, ...marketsResponse } = hasRole
    ? useSelectAllMarketsQuery()
    : useSelectMyMarketsQuery();

  const [createMarketTag, { isLoading }] = useCreateMarketTagMutation();

  const handleSubmit = async (dto: CreateMarketTagDto) => {
    await createMarketTag(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.tags')}
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
      <TextInput
        label={t('columns.name')}
        placeholder={t('columns.name')}
        required
        minLength={MIN_NAME_LENGTH}
        maxLength={MAX_NAME_LENGTH}
        {...form.getInputProps('name')}
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

export const createMarketTagFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.tags'),
      children: <CreateMarketTagModal hasRole={hasRole} />,
    }),
});

export const createMyMarketTagButton = createMarketTagFactory(false);

export const createUserMarketTagButton = createMarketTagFactory(true);
