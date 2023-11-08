import { useEffect } from 'react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Autocomplete,
  CloseButton,
  Group,
  Input,
  MultiSelect,
  Radio,
  Rating,
  Select,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeAllModals, openModal } from '@mantine/modals';
import { ISearch } from '../interfaces';
import { Mode } from '../enums';
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
import { ThingsItem } from './ThingItem';
import { CardsItem } from './CardsItem';
import { PlacesItem } from './PlacesItem';
import { ColorsItem } from './ColorsItem';
import { PrioritiesItem } from './PrioritiesItem';
import {
  selectCards,
  selectCategories,
  selectCities,
  selectColors,
  selectContainers,
  selectItems,
  selectMarkets,
  selectPriorities,
  selectRoles,
  selectShops,
  selectStatuses,
  selectStorages,
  selectUsers,
} from '../../common/utils';
import { items } from '../constants';

type Props = {
  search: ISearch;
  setSearch: (search: ISearch) => void;
  isFetching: boolean;
};

export default function SearchModal(props: Props) {
  const [t] = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm({
    initialValues: {
      ...props.search,
      category: props.search.item && items[+props.search.item - 1][0],
    },
    transformValues: ({ category, modes, users, cards, ...rest }) => ({
      ...rest,
    }),
  });

  useEffect(() => {
    const roles = form.values.roles?.slice(0).sort();
    if (form.values.roles?.toString() !== roles?.toString()) {
      form.setFieldValue('roles', roles);
    }
  }, [form.values.roles]);

  useEffect(() => {
    if (form.values.card !== undefined) {
      form.setFieldValue('card', null);
    }
    if (!props.search.users && form.values.city !== undefined) {
      form.setFieldValue('city', null);
    }
    if (form.values.shop !== undefined) {
      form.setFieldValue('shop', null);
    }
  }, [form.values.user]);

  useEffect(() => {
    if (props.search.users) {
      form.setFieldValue('user', null);
    }
  }, [form.values.city]);

  useEffect(() => {
    if (form.values.market !== undefined) {
      form.setFieldValue('market', null);
    }
    if (form.values.storage !== undefined) {
      form.setFieldValue('storage', null);
    }
  }, [form.values.card]);

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

  const usersResponse = useSelectAllUsersQuery();
  const cardsResponse = useSelectUserCardsQuery(+(form.values.user || ''), {
    skip: props.search.card === undefined || !form.values.user,
  });
  const citiesResponse = useSelectAllCitiesQuery(undefined, {
    skip: props.search.city === undefined,
  });
  const shopsResponse = useSelectAllShopsQuery(undefined, {
    skip: props.search.shop === undefined,
  });
  const marketsResponse = useSelectMainMarketsQuery(undefined, {
    skip: props.search.market === undefined,
  });
  const storagesResponse = useSelectMainStoragesQuery(undefined, {
    skip: props.search.storage === undefined,
  });
  const storesResponse = useSelectMarketStoresQuery(
    +(form.values.market || ''),
    { skip: props.search.store === undefined || !form.values.market },
  );
  const cellsResponse = useSelectStorageCellsQuery(
    +(form.values.storage || ''),
    { skip: props.search.cell === undefined || !form.values.storage },
  );

  const users = selectUsers(usersResponse.data).filter(
    (user) =>
      !props.search.users ||
      !form.values.city ||
      user.city === +form.values.city,
  );
  const cards = selectCards(cardsResponse.data);
  const cities = selectCities(citiesResponse.data).filter(
    (city) =>
      props.search.users ||
      !form.values.user ||
      city.user === +form.values.user,
  );
  const shops = selectShops(shopsResponse.data).filter(
    (shop) =>
      form.values.mode !== Mode.OWNER ||
      !form.values.user ||
      shop.user === +form.values.user,
  );
  const markets = selectMarkets(marketsResponse.data).filter(
    (market) =>
      form.values.mode !== Mode.OWNER ||
      ((!form.values.card || market.card === +form.values.card) &&
        (!form.values.user || cards.find((card) => card.id === market.card))),
  );
  const storages = selectStorages(storagesResponse.data).filter(
    (storage) =>
      form.values.mode !== Mode.OWNER ||
      ((!form.values.card || storage.card === +form.values.card) &&
        (!form.values.user || cards.find((card) => card.id === storage.card))),
  );
  const stores = selectContainers(storesResponse.data);
  const cells = selectContainers(cellsResponse.data);

  const user = users.find((user) => user.id === +form.values.user!);

  const isFetching = props.search.users
    ? usersResponse.isFetching
    : cardsResponse.isFetching ||
      citiesResponse.isFetching ||
      shopsResponse.isFetching ||
      marketsResponse.isFetching ||
      storagesResponse.isFetching;
  const component = props.search.users
    ? UsersItem
    : props.search.cards
    ? CardsItem
    : PlacesItem;
  const data = props.search.users
    ? users
    : [...cards, ...cities, ...shops, ...markets, ...storages];

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
      <Select
        label={t('columns.user')}
        placeholder={`${t('components.total')}: ${users?.length}`}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={users}
        searchable
        allowDeselect
        disabled={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
      {props.search.card !== undefined && (
        <Select
          label={t('columns.card')}
          placeholder={`${t('components.total')}: ${cards.length}`}
          rightSection={
            <RefetchAction {...cardsResponse} skip={!form.values.user} />
          }
          itemComponent={CardsItem}
          data={cards}
          searchable
          allowDeselect
          disabled={cardsResponse.isFetching}
          {...form.getInputProps('card')}
        />
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
      {props.search.modes && (
        <Radio.Group
          label={t('columns.mode')}
          spacing='md'
          {...form.getInputProps('mode')}
        >
          {props.search.modes.map((mode) => (
            <Radio key={mode} label={t('columns.' + mode)} value={mode} />
          ))}
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('mode', null)}
          />
        </Radio.Group>
      )}
      {props.search.city !== undefined && (
        <Select
          label={t('columns.city')}
          placeholder={`${t('components.total')}: ${cities.length}`}
          rightSection={<RefetchAction {...citiesResponse} />}
          itemComponent={PlacesItem}
          data={cities}
          searchable
          allowDeselect
          disabled={citiesResponse.isFetching}
          {...form.getInputProps('city')}
        />
      )}
      {props.search.shop !== undefined && (
        <Select
          label={t('columns.shop')}
          placeholder={`${t('components.total')}: ${shops.length}`}
          itemComponent={PlacesItem}
          data={shops}
          searchable
          allowDeselect
          {...form.getInputProps('shop')}
        />
      )}
      {props.search.market !== undefined && (
        <Select
          label={t('columns.market')}
          placeholder={`${t('components.total')}: ${markets.length}`}
          rightSection={<RefetchAction {...marketsResponse} />}
          itemComponent={PlacesItem}
          data={markets}
          searchable
          allowDeselect
          disabled={marketsResponse.isFetching}
          {...form.getInputProps('market')}
        />
      )}
      {props.search.storage !== undefined && (
        <Select
          label={t('columns.storage')}
          placeholder={`${t('components.total')}: ${storages.length}`}
          rightSection={<RefetchAction {...storagesResponse} />}
          itemComponent={PlacesItem}
          data={storages}
          searchable
          allowDeselect
          disabled={storagesResponse.isFetching}
          {...form.getInputProps('storage')}
        />
      )}
      {props.search.store !== undefined && (
        <Select
          label={t('columns.store')}
          placeholder={`${t('components.total')}: ${stores.length}`}
          rightSection={
            <RefetchAction {...storesResponse} skip={!form.values.market} />
          }
          data={stores}
          searchable
          allowDeselect
          disabled={storesResponse.isFetching}
          {...form.getInputProps('store')}
        />
      )}
      {props.search.cell !== undefined && (
        <Select
          label={t('columns.cell')}
          placeholder={`${t('components.total')}: ${cells.length}`}
          rightSection={
            <RefetchAction {...cellsResponse} skip={!form.values.storage} />
          }
          data={cells}
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
            searchable
            allowDeselect
            {...form.getInputProps('item')}
          />
        </>
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
          data={selectColors()
            .filter((element) => +element.value % 2)
            .map((element, index) => ({
              ...element,
              value: `${index * 2 - 1}`,
            }))}
          searchable
          allowDeselect
          {...form.getInputProps('type')}
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
      {props.search.name !== undefined && (
        <Autocomplete
          label={t('columns.name')}
          placeholder={`${t('components.total')}: ${data.length}`}
          itemComponent={component}
          data={data.map((element) => ({ ...element, value: element.name }))}
          disabled={isFetching}
          {...form.getInputProps('name')}
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
