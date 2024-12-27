import { t } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Radio, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMarketGoodMutation,
  useCreateShopGoodMutation,
  useCreateStorageGoodMutation,
} from './goods.api';
import {
  useSelectAllShopsQuery,
  useSelectMyShopsQuery,
} from '../shops/shops.api';
import {
  useSelectAllRentsQuery,
  useSelectMyRentsQuery,
} from '../rents/rents.api';
import {
  useSelectAllLeasesQuery,
  useSelectMyLeasesQuery,
} from '../leases/leases.api';
import { CreateAnyGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import {
  selectItems,
  selectKits,
  selectLeases,
  selectRents,
  selectShops,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateGoodModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const places = ['shop', 'market', 'storage'] as const;

  const [place, setPlace] = useState<(typeof places)[number]>(places[0]);

  const form = useForm({
    initialValues: {
      shop: '',
      rent: '',
      lease: '',
      item: '',
      description: '',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({ shop, rent, lease, item, kit, ...rest }) => ({
      ...rest,
      shopId: +shop,
      rentId: +rent,
      leaseId: +lease,
      item: +item,
      kit: +kit,
    }),
  });

  const { data: shops, ...shopsResponse } = hasRole
    ? useSelectAllShopsQuery()
    : useSelectMyShopsQuery();
  const { data: rents, ...rentsResponse } = hasRole
    ? useSelectAllRentsQuery()
    : useSelectMyRentsQuery();
  const { data: leases, ...leasesResponse } = hasRole
    ? useSelectAllLeasesQuery()
    : useSelectMyLeasesQuery();

  const [createShopGood, { isLoading: isShopLoading }] =
    useCreateShopGoodMutation();
  const [createMarketGood, { isLoading: isMarketLoading }] =
    useCreateMarketGoodMutation();
  const [createStorageGood, { isLoading: isStorageLoading }] =
    useCreateStorageGoodMutation();

  const handleSubmit = async (dto: CreateAnyGoodDto) => {
    switch (place) {
      case 'shop':
        await createShopGood(dto);
        break;
      case 'market':
        await createMarketGood(dto);
        break;
      case 'storage':
        await createStorageGood(dto);
        break;
      default:
        break;
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isShopLoading || isMarketLoading || isStorageLoading}
      text={t('actions.create') + ' ' + t('modals.goods')}
    >
      <Radio.Group
        label={t('columns.place')}
        spacing='md'
        value={place}
        onChange={(value) => setPlace(value as (typeof places)[number])}
      >
        {places.map((place) => (
          <Radio key={place} label={t(`columns.${place}`)} value={place} />
        ))}
      </Radio.Group>
      {place === 'shop' && (
        <Select
          label={t('columns.shop')}
          placeholder={t('columns.shop')}
          rightSection={<RefetchAction {...shopsResponse} />}
          itemComponent={PlacesItem}
          data={selectShops(shops)}
          limit={20}
          searchable
          required
          readOnly={shopsResponse.isFetching}
          {...form.getInputProps('shop')}
        />
      )}
      {place === 'market' && (
        <Select
          label={t('columns.rent')}
          placeholder={t('columns.rent')}
          rightSection={<RefetchAction {...rentsResponse} />}
          itemComponent={PlacesItem}
          data={selectRents(rents)}
          limit={20}
          searchable
          required
          readOnly={rentsResponse.isFetching}
          {...form.getInputProps('rent')}
        />
      )}
      {place === 'storage' && (
        <Select
          label={t('columns.lease')}
          placeholder={t('columns.lease')}
          rightSection={<RefetchAction {...leasesResponse} />}
          itemComponent={PlacesItem}
          data={selectLeases(leases)}
          limit={20}
          searchable
          required
          readOnly={leasesResponse.isFetching}
          {...form.getInputProps('lease')}
        />
      )}
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={+form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems()}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label={t('columns.intake')}
        placeholder={t('columns.intake')}
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label={t('columns.kit')}
        placeholder={t('columns.kit')}
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
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

export const createGoodFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.goods'),
      children: <CreateGoodModal hasRole={hasRole} />,
    }),
});

export const createMyGoodButton = createGoodFactory(false);

export const createUserGoodButton = createGoodFactory(true);
