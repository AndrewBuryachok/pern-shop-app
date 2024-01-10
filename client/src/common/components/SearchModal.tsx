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
  TextInput,
  Textarea,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { closeAllModals, openModal } from '@mantine/modals';
import { ISearch } from '../interfaces';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import { useSelectUserCardsQuery } from '../../features/cards/cards.api';
import { useSelectAllCitiesQuery } from '../../features/cities/cities.api';
import { useSelectAllShopsQuery } from '../../features/shops/shops.api';
import { useSelectMainMarketsQuery } from '../../features/markets/markets.api';
import { useSelectMainStoragesQuery } from '../../features/storages/storages.api';
import { useSelectMarketStoresQuery } from '../../features/stores/stores.api';
import { useSelectStorageCellsQuery } from '../../features/cells/cells.api';
import CustomForm from './CustomForm';
import RefetchAction from './RefetchAction';
import CustomAvatar from './CustomAvatar';
import { UsersItem } from './UsersItem';
import ThingImage from './ThingImage';
import { ThingsItem } from './ThingsItem';
import { CardsItem } from './CardsItem';
import { PlacesItem } from './PlacesItem';
import { ColorsItem } from './ColorsItem';
import { PrioritiesItem } from './PrioritiesItem';
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
  selectCategories,
  selectCities,
  selectContainers,
  selectItems,
  selectKinds,
  selectKits,
  selectMarkets,
  selectPriorities,
  selectResults,
  selectRoles,
  selectShops,
  selectStatuses,
  selectStorages,
  selectUsers,
  unscaleDate,
  unscaleMaxPrice,
  unscaleMaxSearch,
  unscaleMaxSum,
  unscaleMinPrice,
  unscaleMinSearch,
  unscaleMinSum,
} from '../../common/utils';
import { MAX_AMOUNT_VALUE, MAX_INTAKE_VALUE, items } from '../constants';

type Props = {
  search: ISearch;
  setSearch: (search: ISearch) => void;
  isFetching: boolean;
};

export default function SearchModal(props: Props) {
  const [t, i18n] = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm({
    initialValues: {
      ...props.search,
      category: props.search.item && items[+props.search.item - 1][0],
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
    transformValues: ({ category, modes, ...rest }) => ({
      ...rest,
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
    if (form.values.store !== undefined) {
      form.setFieldValue('store', null);
    }
  }, [form.values.market]);

  useEffect(() => {
    if (form.values.cell !== undefined) {
      form.setFieldValue('cell', null);
    }
  }, [form.values.storage]);

  useEffect(() => {
    if (form.values.item !== undefined) {
      form.setFieldValue('item', null);
    }
  }, [form.values.category]);

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
  const { data: stores, ...storesResponse } = useSelectMarketStoresQuery(
    +(form.values.market || ''),
    { skip: props.search.store === undefined || !form.values.market },
  );
  const { data: cells, ...cellsResponse } = useSelectStorageCellsQuery(
    +(form.values.storage || ''),
    { skip: props.search.cell === undefined || !form.values.storage },
  );

  const user = users?.find((user) => user.id === +form.values.user!);

  const handleSubmit = (search: ISearch) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(search)) {
      if (value && (!Array.isArray(value) || value.length)) {
        updatedSearchParams.set(key, value);
      } else {
        updatedSearchParams.delete(key);
      }
    }
    setSearchParams(updatedSearchParams);
    props.setSearch({ ...props.search, ...search });
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
        disabled={usersResponse.isFetching}
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
          disabled={cardsResponse.isFetching}
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
          itemComponent={ColorsItem}
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
          disabled={citiesResponse.isFetching}
          {...form.getInputProps('city')}
        />
      )}
      {props.search.shop !== undefined && (
        <Select
          label={t('columns.shop')}
          placeholder={`${t('components.total')}: ${shops?.length || 0}`}
          rightSection={<RefetchAction {...citiesResponse} />}
          itemComponent={PlacesItem}
          data={selectShops(shops)}
          limit={20}
          searchable
          allowDeselect
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
          disabled={marketsResponse.isFetching}
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
          disabled={storagesResponse.isFetching}
          {...form.getInputProps('storage')}
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
          disabled={storesResponse.isFetching}
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
          disabled={cellsResponse.isFetching}
          {...form.getInputProps('cell')}
        />
      )}
      {props.search.item !== undefined && (
        <>
          <Select
            label={t('columns.category')}
            placeholder={t('columns.category')}
            data={selectCategories()}
            searchable
            allowDeselect
            {...form.getInputProps('category')}
          />
          <Select
            label={t('columns.item')}
            placeholder={t('columns.item')}
            icon={form.values.item && <ThingImage item={+form.values.item} />}
            iconWidth={48}
            itemComponent={ThingsItem}
            data={selectItems(form.values.category || '')}
            limit={20}
            searchable
            allowDeselect
            {...form.getInputProps('item')}
          />
        </>
      )}
      {props.search.title !== undefined && (
        <TextInput
          label={t('columns.title')}
          placeholder={t('columns.title')}
          {...form.getInputProps('title')}
        />
      )}
      {props.search.description !== undefined && (
        <Textarea
          label={t('columns.description')}
          placeholder={t('columns.description')}
          {...form.getInputProps('description')}
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
      {props.search.kind !== undefined && (
        <Select
          label={t('columns.kind')}
          placeholder={t('columns.kind')}
          itemComponent={ColorsItem}
          data={selectKinds()}
          searchable
          allowDeselect
          {...form.getInputProps('kind')}
        />
      )}
      {props.search.priority !== undefined && (
        <Select
          label={t('columns.priority')}
          placeholder={t('columns.priority')}
          itemComponent={PrioritiesItem}
          data={selectPriorities()}
          searchable
          allowDeselect
          {...form.getInputProps('priority')}
        />
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
