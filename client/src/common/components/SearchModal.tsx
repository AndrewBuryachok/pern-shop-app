import 'dayjs/locale/uk';
import { useEffect } from 'react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  CloseButton,
  Group,
  Input,
  MultiSelect,
  NumberInput,
  Radio,
  Rating,
  Select,
  Slider,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { closeAllModals, openModal } from '@mantine/modals';
import { ISearch } from '../interfaces';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import { useSelectUserCardsQuery } from '../../features/cards/cards.api';
import { useSelectAllCitiesQuery } from '../../features/cities/cities.api';
import { useSelectAllFarmsQuery } from '../../features/farms/farms.api';
import { useSelectAllShopsQuery } from '../../features/shops/shops.api';
import { useSelectMainMarketsQuery } from '../../features/markets/markets.api';
import { useSelectMainStoragesQuery } from '../../features/storages/storages.api';
import { useSelectMainStationsQuery } from '../../features/stations/stations.api';
import { useSelectMarketTagsQuery } from '../../features/markets-tags/markets-tags.api';
import { useSelectStorageTagsQuery } from '../../features/storages-tags/storages-tags.api';
import {
  useSelectMarketStoresQuery,
  useSelectTagStoresQuery,
} from '../../features/stores/stores.api';
import {
  useSelectStorageCellsQuery,
  useSelectTagCellsQuery,
} from '../../features/cells/cells.api';
import { useSelectStationDrawersQuery } from '../../features/drawers/drawers.api';
import CustomForm from './CustomForm';
import RefetchAction from './RefetchAction';
import CustomAvatar from './CustomAvatar';
import ThingImage from './ThingImage';
import { UsersItem } from './UsersItem';
import { CardsItem } from './CardsItem';
import { ThingsItem } from './ThingsItem';
import { PlacesItem } from './PlacesItem';
import { RolesItem } from './RolesItem';
import { ColorsItem } from './ColorsItem';
import {
  scaleDate,
  scaleMaxPrice,
  scaleMaxSearch,
  scaleMaxSum,
  scaleMinPrice,
  scaleMinSearch,
  scaleMinSum,
  scalePrice,
  scaleSum,
  searchTypes,
  selectCards,
  selectCities,
  selectContainers,
  selectFarms,
  selectItems,
  selectKits,
  selectMarkets,
  selectMarks,
  selectResults,
  selectRoles,
  selectShops,
  selectStations,
  selectStatuses,
  selectStorages,
  selectTags,
  selectUsers,
  unscaleDate,
  unscaleMaxPrice,
  unscaleMaxSearch,
  unscaleMaxSum,
  unscaleMinPrice,
  unscaleMinSearch,
  unscaleMinSum,
} from '../../common/utils';
import {
  MAX_ACTIVITY_LENGTH,
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
} from '../constants';

type Props = {
  search: ISearch;
  isFetching: boolean;
};

export default function SearchModal(props: Props) {
  const [t, i18n] = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm({
    initialValues: {
      ...props.search,
      minSum: unscaleMinSum(props.search.minSum),
      maxSum: unscaleMaxSum(props.search.maxSum),
      minAmount: unscaleMinSearch(props.search.minAmount),
      maxAmount: unscaleMaxSearch(props.search.maxAmount, MAX_AMOUNT_VALUE),
      minIntake: unscaleMinSearch(props.search.minIntake),
      maxIntake: unscaleMaxSearch(props.search.maxIntake, MAX_INTAKE_VALUE),
      minPrice: unscaleMinPrice(props.search.minPrice),
      maxPrice: unscaleMaxPrice(props.search.maxPrice),
      minDate: unscaleDate(props.search.minDate),
      maxDate: unscaleDate(props.search.maxDate),
    },
    transformValues: ({ modes, ...rest }) => ({
      ...rest,
      page: 0,
      minSum: scaleMinSum(rest.minSum),
      maxSum: scaleMaxSum(rest.maxSum),
      minAmount: scaleMinSearch(rest.minAmount),
      maxAmount: scaleMaxSearch(rest.maxAmount, MAX_AMOUNT_VALUE),
      minIntake: scaleMinSearch(rest.minIntake),
      maxIntake: scaleMaxSearch(rest.maxIntake, MAX_INTAKE_VALUE),
      minPrice: scaleMinPrice(rest.minPrice),
      maxPrice: scaleMaxPrice(rest.maxPrice),
      minDate: scaleDate(rest.minDate),
      maxDate: scaleDate(rest.maxDate),
    }),
  });

  useEffect(() => {
    if (form.values.id === undefined) {
      form.setFieldValue('id', null);
    }
  }, [form.values.id]);

  useEffect(() => {
    if (form.values.card !== undefined) {
      form.setFieldValue('card', null);
    }
  }, [form.values.user]);

  useEffect(() => {
    const roles = form.values.roles?.slice(0).sort();
    if (form.values.roles?.toString() !== roles?.toString()) {
      form.setFieldValue('roles', roles);
    }
  }, [form.values.roles]);

  useEffect(() => {
    if (form.values.marketTag !== undefined) {
      form.setFieldValue('marketTag', null);
    }
  }, [form.values.market]);

  useEffect(() => {
    if (form.values.storageTag !== undefined) {
      form.setFieldValue('storageTag', null);
    }
  }, [form.values.storage]);

  useEffect(() => {
    if (form.values.store !== undefined) {
      form.setFieldValue('store', null);
    }
  }, [form.values.marketTag]);

  useEffect(() => {
    if (form.values.cell !== undefined) {
      form.setFieldValue('cell', null);
    }
  }, [form.values.storageTag]);

  useEffect(() => {
    if (form.values.drawer !== undefined) {
      form.setFieldValue('drawer', null);
    }
  }, [form.values.station]);

  useEffect(form.reset, []);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: cards, ...cardsResponse } = useSelectUserCardsQuery(
    +(form.values.user || ''),
    { skip: props.search.card === undefined || !form.values.user },
  );
  const { data: cities, ...citiesResponse } = useSelectAllCitiesQuery(
    undefined,
    { skip: props.search.city === undefined },
  );
  const { data: farms, ...farmsResponse } = useSelectAllFarmsQuery(undefined, {
    skip: props.search.farm === undefined,
  });
  const { data: shops, ...shopsResponse } = useSelectAllShopsQuery(undefined, {
    skip: props.search.shop === undefined,
  });
  const { data: markets, ...marketsResponse } = useSelectMainMarketsQuery(
    undefined,
    { skip: props.search.market === undefined },
  );
  const { data: storages, ...storagesResponse } = useSelectMainStoragesQuery(
    undefined,
    { skip: props.search.storage === undefined },
  );
  const { data: stations, ...stationsResponse } = useSelectMainStationsQuery(
    undefined,
    { skip: props.search.station === undefined },
  );
  const { data: marketsTags, ...marketsTagsResponse } =
    useSelectMarketTagsQuery(+(form.values.market || ''), {
      skip: props.search.marketTag === undefined || !form.values.market,
    });
  const { data: storagesTags, ...storagesTagsResponse } =
    useSelectStorageTagsQuery(+(form.values.storage || ''), {
      skip: props.search.storageTag === undefined || !form.values.storage,
    });
  const { data: stores, ...storesResponse } = form.values.marketTag
    ? useSelectTagStoresQuery(+(form.values.marketTag || ''), {
        skip: props.search.store === undefined || !form.values.marketTag,
      })
    : useSelectMarketStoresQuery(+(form.values.market || ''), {
        skip: props.search.store === undefined || !form.values.market,
      });
  const { data: cells, ...cellsResponse } = form.values.storageTag
    ? useSelectTagCellsQuery(+(form.values.storageTag || ''), {
        skip: props.search.cell === undefined || !form.values.storageTag,
      })
    : useSelectStorageCellsQuery(+(form.values.storage || ''), {
        skip: props.search.cell === undefined || !form.values.storage,
      });
  const { data: drawers, ...drawersResponse } = useSelectStationDrawersQuery(
    +(form.values.station || ''),
    { skip: props.search.drawer === undefined || !form.values.station },
  );

  const user = users?.find((user) => user.id === +form.values.user!);

  const handleSubmit = (search: ISearch) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(search)) {
      if (value && (!Array.isArray(value) || value.length)) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    }
    setSearchParams(newSearchParams);
    closeAllModals();
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={props.isFetching}
      text={t('components.save')}
      isChanged={!form.isDirty()}
    >
      <NumberInput
        label={t('columns.id')}
        placeholder={t('columns.id')}
        min={1}
        {...form.getInputProps('id')}
      />
      <Select
        label={t('columns.user')}
        placeholder={`${t('components.total')}: ${users?.length || 0}`}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        limit={20}
        searchable
        allowDeselect
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
      {props.search.card !== undefined && (
        <Select
          label={t('columns.card')}
          placeholder={`${t('components.total')}: ${cards?.length || 0}`}
          rightSection={
            <RefetchAction {...cardsResponse} skip={!form.values.user} />
          }
          itemComponent={CardsItem}
          data={selectCards(cards)}
          limit={20}
          searchable
          allowDeselect
          readOnly={cardsResponse.isFetching}
          {...form.getInputProps('card')}
        />
      )}
      {props.search.modes && (
        <Radio.Group
          label={t('columns.mode')}
          spacing='md'
          {...form.getInputProps('mode')}
        >
          {props.search.modes.map((mode) => (
            <Radio key={mode} label={t(`columns.${mode}`)} value={mode} />
          ))}
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('mode', null)}
          />
        </Radio.Group>
      )}
      {props.search.roles && (
        <MultiSelect
          label={t('columns.roles')}
          placeholder={t('columns.roles')}
          itemComponent={RolesItem}
          data={selectRoles()}
          searchable
          {...form.getInputProps('roles')}
        />
      )}
      {props.search.city !== undefined && (
        <Select
          label={t('columns.city')}
          placeholder={`${t('components.total')}: ${cities?.length || 0}`}
          rightSection={<RefetchAction {...citiesResponse} />}
          itemComponent={PlacesItem}
          data={selectCities(cities)}
          limit={20}
          searchable
          allowDeselect
          readOnly={citiesResponse.isFetching}
          {...form.getInputProps('city')}
        />
      )}
      {props.search.farm !== undefined && (
        <Select
          label={t('columns.farm')}
          placeholder={`${t('components.total')}: ${farms?.length || 0}`}
          rightSection={<RefetchAction {...farmsResponse} />}
          itemComponent={PlacesItem}
          data={selectFarms(farms)}
          limit={20}
          searchable
          allowDeselect
          readOnly={farmsResponse.isFetching}
          {...form.getInputProps('farm')}
        />
      )}
      {props.search.shop !== undefined && (
        <Select
          label={t('columns.shop')}
          placeholder={`${t('components.total')}: ${shops?.length || 0}`}
          rightSection={<RefetchAction {...shopsResponse} />}
          itemComponent={PlacesItem}
          data={selectShops(shops)}
          limit={20}
          searchable
          allowDeselect
          readOnly={shopsResponse.isFetching}
          {...form.getInputProps('shop')}
        />
      )}
      {props.search.market !== undefined && (
        <Select
          label={t('columns.market')}
          placeholder={`${t('components.total')}: ${markets?.length || 0}`}
          rightSection={<RefetchAction {...marketsResponse} />}
          itemComponent={PlacesItem}
          data={selectMarkets(markets)}
          limit={20}
          searchable
          allowDeselect
          readOnly={marketsResponse.isFetching}
          {...form.getInputProps('market')}
        />
      )}
      {props.search.storage !== undefined && (
        <Select
          label={t('columns.storage')}
          placeholder={`${t('components.total')}: ${storages?.length || 0}`}
          rightSection={<RefetchAction {...storagesResponse} />}
          itemComponent={PlacesItem}
          data={selectStorages(storages)}
          limit={20}
          searchable
          allowDeselect
          readOnly={storagesResponse.isFetching}
          {...form.getInputProps('storage')}
        />
      )}
      {props.search.station !== undefined && (
        <Select
          label={t('columns.station')}
          placeholder={`${t('components.total')}: ${stations?.length || 0}`}
          rightSection={<RefetchAction {...stationsResponse} />}
          itemComponent={PlacesItem}
          data={selectStations(stations)}
          limit={20}
          searchable
          allowDeselect
          readOnly={stationsResponse.isFetching}
          {...form.getInputProps('station')}
        />
      )}
      {props.search.marketTag !== undefined && (
        <Select
          label={t('columns.tag')}
          placeholder={`${t('components.total')}: ${marketsTags?.length || 0}`}
          rightSection={
            <RefetchAction
              {...marketsTagsResponse}
              skip={!form.values.market}
            />
          }
          data={selectTags(marketsTags)}
          limit={20}
          searchable
          allowDeselect
          readOnly={marketsTagsResponse.isFetching}
          {...form.getInputProps('marketTag')}
        />
      )}
      {props.search.storageTag !== undefined && (
        <Select
          label={t('columns.tag')}
          placeholder={`${t('components.total')}: ${storagesTags?.length || 0}`}
          rightSection={
            <RefetchAction
              {...storagesTagsResponse}
              skip={!form.values.storage}
            />
          }
          data={selectTags(storagesTags)}
          limit={20}
          searchable
          allowDeselect
          readOnly={storagesTagsResponse.isFetching}
          {...form.getInputProps('storageTag')}
        />
      )}
      {props.search.store !== undefined && (
        <Select
          label={t('columns.store')}
          placeholder={`${t('components.total')}: ${stores?.length || 0}`}
          rightSection={
            <RefetchAction {...storesResponse} skip={!form.values.market} />
          }
          data={selectContainers(stores)}
          limit={20}
          searchable
          allowDeselect
          readOnly={storesResponse.isFetching}
          {...form.getInputProps('store')}
        />
      )}
      {props.search.cell !== undefined && (
        <Select
          label={t('columns.cell')}
          placeholder={`${t('components.total')}: ${cells?.length || 0}`}
          rightSection={
            <RefetchAction {...cellsResponse} skip={!form.values.storage} />
          }
          data={selectContainers(cells)}
          limit={20}
          searchable
          allowDeselect
          readOnly={cellsResponse.isFetching}
          {...form.getInputProps('cell')}
        />
      )}
      {props.search.drawer !== undefined && (
        <Select
          label={t('columns.drawer')}
          placeholder={`${t('components.total')}: ${drawers?.length || 0}`}
          rightSection={
            <RefetchAction {...drawersResponse} skip={!form.values.station} />
          }
          data={selectContainers(drawers)}
          limit={20}
          searchable
          allowDeselect
          readOnly={drawersResponse.isFetching}
          {...form.getInputProps('drawer')}
        />
      )}
      {props.search.item !== undefined && (
        <Select
          label={t('columns.item')}
          placeholder={t('columns.item')}
          icon={form.values.item && <ThingImage item={+form.values.item} />}
          iconWidth={48}
          itemComponent={ThingsItem}
          data={selectItems()}
          limit={20}
          searchable
          allowDeselect
          {...form.getInputProps('item')}
        />
      )}
      {props.search.description !== undefined && (
        <Textarea
          label={t('columns.description')}
          placeholder={t('columns.description')}
          maxLength={MAX_DESCRIPTION_LENGTH}
          {...form.getInputProps('description')}
        />
      )}
      {props.search.activity !== undefined && (
        <TextInput
          label={t('columns.activity')}
          placeholder={t('columns.activity')}
          maxLength={MAX_ACTIVITY_LENGTH}
          {...form.getInputProps('activity')}
        />
      )}
      {props.search.type !== undefined && (
        <Select
          label={t('columns.type')}
          placeholder={t('columns.type')}
          itemComponent={ColorsItem}
          data={searchTypes()}
          searchable
          allowDeselect
          {...form.getInputProps('type')}
        />
      )}
      {(props.search.minSum && props.search.maxSum) !== undefined && (
        <Input.Wrapper label={t('columns.sum')}>
          <Slider
            min={1}
            max={2000}
            scale={scaleSum}
            marks={[{ value: 1000 }]}
            inverted
            {...form.getInputProps('minSum')}
          />
          <Slider
            min={1}
            max={2000}
            scale={scaleSum}
            marks={[{ value: 1000 }]}
            {...form.getInputProps('maxSum')}
          />
        </Input.Wrapper>
      )}
      {(props.search.minAmount && props.search.maxAmount) !== undefined && (
        <Input.Wrapper label={t('columns.amount')}>
          <Slider
            min={1}
            max={MAX_AMOUNT_VALUE}
            marks={[{ value: 1 }, { value: MAX_AMOUNT_VALUE }]}
            inverted
            {...form.getInputProps('minAmount')}
          />
          <Slider
            min={1}
            max={MAX_AMOUNT_VALUE}
            marks={[{ value: 1 }, { value: MAX_AMOUNT_VALUE }]}
            {...form.getInputProps('maxAmount')}
          />
        </Input.Wrapper>
      )}
      {(props.search.minIntake && props.search.maxIntake) !== undefined && (
        <Input.Wrapper label={t('columns.intake')}>
          <Slider
            min={1}
            max={MAX_INTAKE_VALUE}
            marks={[{ value: 1 }, { value: MAX_INTAKE_VALUE }]}
            inverted
            {...form.getInputProps('minIntake')}
          />
          <Slider
            min={1}
            max={MAX_INTAKE_VALUE}
            marks={[{ value: 1 }, { value: MAX_INTAKE_VALUE }]}
            {...form.getInputProps('maxIntake')}
          />
        </Input.Wrapper>
      )}
      {props.search.kit !== undefined && (
        <Select
          label={t('columns.kit')}
          placeholder={t('columns.kit')}
          data={selectKits()}
          searchable
          allowDeselect
          {...form.getInputProps('kit')}
        />
      )}
      {(props.search.minPrice && props.search.maxPrice) !== undefined && (
        <Input.Wrapper label={t('columns.price')}>
          <Slider
            min={1}
            max={200}
            scale={scalePrice}
            marks={[{ value: 100 }]}
            inverted
            {...form.getInputProps('minPrice')}
          />
          <Slider
            min={1}
            max={200}
            scale={scalePrice}
            marks={[{ value: 100 }]}
            {...form.getInputProps('maxPrice')}
          />
        </Input.Wrapper>
      )}
      {props.search.status !== undefined && (
        <Select
          label={t('columns.status')}
          placeholder={t('columns.status')}
          itemComponent={ColorsItem}
          data={selectStatuses()}
          searchable
          allowDeselect
          {...form.getInputProps('status')}
        />
      )}
      {props.search.mark !== undefined && (
        <Select
          label={t('columns.mark')}
          placeholder={t('columns.mark')}
          data={selectMarks()}
          searchable
          allowDeselect
          {...form.getInputProps('mark')}
        />
      )}
      {props.search.result !== undefined && (
        <Select
          label={t('columns.result')}
          placeholder={t('columns.result')}
          itemComponent={ColorsItem}
          data={selectResults()}
          searchable
          allowDeselect
          {...form.getInputProps('result')}
        />
      )}
      {props.search.rate !== undefined && (
        <Input.Wrapper label={t('columns.rate')}>
          <Group spacing={8}>
            <Rating {...form.getInputProps('rate')} />
            <CloseButton
              size={24}
              iconSize={16}
              onClick={() => form.setFieldValue('rate', null)}
            />
          </Group>
        </Input.Wrapper>
      )}
      {props.search.minDate !== undefined && (
        <DatePicker
          label={t('columns.created') + ' ' + t('columns.after')}
          placeholder={t('columns.created') + ' ' + t('columns.after')}
          locale={i18n.language}
          {...form.getInputProps('minDate')}
        />
      )}
      {props.search.maxDate !== undefined && (
        <DatePicker
          label={t('columns.created') + ' ' + t('columns.before')}
          placeholder={t('columns.created') + ' ' + t('columns.before')}
          locale={i18n.language}
          {...form.getInputProps('maxDate')}
        />
      )}
    </CustomForm>
  );
}

export const openSearchModal = (props: Props) =>
  openModal({
    title: t('components.search'),
    children: <SearchModal {...props} />,
  });
