import { useEffect } from 'react';
import { Autocomplete, Checkbox, Radio, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeAllModals, openModal } from '@mantine/modals';
import { ISearch } from '../interfaces';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import { useSelectUserCardsQuery } from '../../features/cards/cards.api';
import { useSelectAllCitiesQuery } from '../../features/cities/cities.api';
import { useSelectAllShopsQuery } from '../../features/shops/shops.api';
import { useSelectAllMarketsQuery } from '../../features/markets/markets.api';
import { useSelectAllStoragesQuery } from '../../features/storages/storages.api';
import { useSelectMarketStoresQuery } from '../../features/stores/stores.api';
import { useSelectStorageCellsQuery } from '../../features/cells/cells.api';
import CustomForm from './CustomForm';
import CustomAvatar from './CustomAvatar';
import { UsersItem } from './UsersItem';
import ThingImage from './ThingImage';
import { ThingsItem } from './ThingItem';
import { CardsItem } from './CardsItem';
import { PlacesItem } from './PlacesItem';
import {
  selectCards,
  selectCategories,
  selectCities,
  selectContainers,
  selectItems,
  selectMarkets,
  selectShops,
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
  const form = useForm({
    initialValues: {
      ...props.search,
      filters:
        props.search.filters
          ?.filter((filter) => filter.value)
          .map((filter) => filter.label.toLowerCase()) || [],
      category: props.search.item && items[+props.search.item - 1][0],
    },
    transformValues: ({
      user,
      card,
      filters,
      city,
      shop,
      market,
      storage,
      store,
      cell,
      category,
      item,
      type,
      ...other
    }) => ({
      ...other,
      user: user === null ? '' : user,
      card: card === null ? '' : card,
      filters: props.search.filters?.map((filter) => ({
        ...filter,
        value: filters.includes(filter.label.toLowerCase()),
      })),
      city: city === null ? '' : city,
      shop: shop === null ? '' : shop,
      market: market === null ? '' : market,
      storage: storage === null ? '' : storage,
      store: store === null ? '' : store,
      cell: cell === null ? '' : cell,
      item: item === null ? '' : item,
      type: type === null ? '' : type,
    }),
  });

  useEffect(() => {
    if (form.values.card !== undefined) {
      form.setFieldValue('card', '');
    }
    if (form.values.city !== undefined) {
      form.setFieldValue('city', '');
    }
    if (form.values.shop !== undefined) {
      form.setFieldValue('shop', '');
    }
    if (form.values.market !== undefined) {
      form.setFieldValue('market', '');
    }
    if (form.values.storage !== undefined) {
      form.setFieldValue('storage', '');
    }
  }, [form.values.user]);

  useEffect(() => {
    if (form.values.market !== undefined) {
      form.setFieldValue('market', '');
    }
    if (form.values.storage !== undefined) {
      form.setFieldValue('storage', '');
    }
  }, [form.values.card]);

  useEffect(() => {
    if (form.values.store !== undefined) {
      form.setFieldValue('store', '');
    }
  }, [form.values.market]);

  useEffect(() => {
    if (form.values.cell !== undefined) {
      form.setFieldValue('cell', '');
    }
  }, [form.values.storage]);

  useEffect(() => {
    if (form.values.item !== undefined) {
      form.setFieldValue('item', '');
    }
  }, [form.values.category]);

  useEffect(() => {
    form.setFieldValue('card', props.search.card);
    form.setFieldValue('city', props.search.city);
    form.setFieldValue('shop', props.search.shop);
    form.setFieldValue('market', props.search.market);
    form.setFieldValue('storage', props.search.storage);
    form.setFieldValue('store', props.search.store);
    form.setFieldValue('cell', props.search.cell);
    form.setFieldValue('item', props.search.item);
  }, []);

  const users = selectUsers(useSelectAllUsersQuery().data);
  const cards = selectCards(
    useSelectUserCardsQuery(+(form.values.user || ''), {
      skip: !form.values.user || props.search.card === undefined,
    }).data,
  );
  const cities = selectCities(
    useSelectAllCitiesQuery(undefined, {
      skip: props.search.city === undefined,
    }).data,
  ).filter(
    (city) =>
      props.search.users ||
      !form.values.user ||
      city.user === +form.values.user,
  );
  const shops = selectShops(
    useSelectAllShopsQuery(undefined, {
      skip: props.search.shop === undefined,
    }).data,
  ).filter(
    (shop) =>
      (form.values.mode && !form.values.filters.includes('owner')) ||
      !form.values.user ||
      shop.user === +form.values.user,
  );
  const markets = selectMarkets(
    useSelectAllMarketsQuery(undefined, {
      skip: props.search.market === undefined,
    }).data,
  ).filter(
    (market) =>
      (form.values.mode && !form.values.filters.includes('owner')) ||
      ((!form.values.card || market.card === +form.values.card) &&
        (!form.values.user || cards.find((card) => card.id === market.card))),
  );
  const storages = selectStorages(
    useSelectAllStoragesQuery(undefined, {
      skip: props.search.storage === undefined,
    }).data,
  ).filter(
    (storage) =>
      (form.values.mode && !form.values.filters.includes('owner')) ||
      ((!form.values.card || storage.card === +form.values.card) &&
        (!form.values.user || cards.find((card) => card.id === storage.card))),
  );
  const stores = selectContainers(
    useSelectMarketStoresQuery(+(form.values.market || ''), {
      skip: !form.values.market || props.search.store === undefined,
    }).data,
  );
  const cells = selectContainers(
    useSelectStorageCellsQuery(+(form.values.storage || ''), {
      skip: !form.values.storage || props.search.cell === undefined,
    }).data,
  );

  const component = props.search.users
    ? UsersItem
    : props.search.cards
    ? CardsItem
    : PlacesItem;
  const data = props.search.users
    ? users
    : [...cards, ...cities, ...shops, ...markets, ...storages];

  const user = users?.find((user) => user.id === +form.values.user!);

  const handleSubmit = (search: ISearch) => {
    props.setSearch(search);
    closeAllModals();
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={props.isFetching}
      text={'Save parameters'}
    >
      <Select
        label='User'
        placeholder={`Total: ${users?.length}`}
        icon={user && <CustomAvatar {...user} status={!!user.status} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={users}
        searchable
        allowDeselect
        {...form.getInputProps('user')}
      />
      {props.search.card !== undefined && (
        <Select
          label='Card'
          placeholder={`Total: ${cards.length}`}
          itemComponent={CardsItem}
          data={cards}
          searchable
          allowDeselect
          {...form.getInputProps('card')}
        />
      )}
      {props.search.mode && (
        <Radio.Group label='Mode' spacing='md' {...form.getInputProps('mode')}>
          {['OR', 'AND'].map((label, index) => (
            <Radio key={label} label={label} value={`${!!index}`} />
          ))}
        </Radio.Group>
      )}
      {props.search.filters && (
        <Checkbox.Group
          label='Filters'
          spacing='md'
          {...form.getInputProps('filters')}
        >
          {props.search.filters.map((filter) => (
            <Checkbox
              key={filter.label}
              label={filter.label}
              value={filter.label.toLowerCase()}
            />
          ))}
        </Checkbox.Group>
      )}
      {props.search.city !== undefined && (
        <Select
          label='City'
          placeholder={`Total: ${cities.length}`}
          itemComponent={PlacesItem}
          data={cities}
          searchable
          allowDeselect
          {...form.getInputProps('city')}
        />
      )}
      {props.search.shop !== undefined && (
        <Select
          label='Shop'
          placeholder={`Total: ${shops.length}`}
          itemComponent={PlacesItem}
          data={shops}
          searchable
          allowDeselect
          {...form.getInputProps('shop')}
        />
      )}
      {props.search.market !== undefined && (
        <Select
          label='Market'
          placeholder={`Total: ${markets.length}`}
          itemComponent={PlacesItem}
          data={markets}
          searchable
          allowDeselect
          {...form.getInputProps('market')}
        />
      )}
      {props.search.storage !== undefined && (
        <Select
          label='Storage'
          placeholder={`Total: ${storages.length}`}
          itemComponent={PlacesItem}
          data={storages}
          searchable
          allowDeselect
          {...form.getInputProps('storage')}
        />
      )}
      {props.search.store !== undefined && (
        <Select
          label='Store'
          placeholder={`Total: ${stores.length}`}
          data={stores}
          searchable
          allowDeselect
          {...form.getInputProps('store')}
        />
      )}
      {props.search.cell !== undefined && (
        <Select
          label='Cell'
          placeholder={`Total: ${cells.length}`}
          data={cells}
          searchable
          allowDeselect
          {...form.getInputProps('cell')}
        />
      )}
      {props.search.name !== undefined && (
        <Autocomplete
          label='Name'
          placeholder={`Total: ${data.length}`}
          itemComponent={component}
          data={data.map((element) => ({ ...element, value: element.name }))}
          {...form.getInputProps('name')}
        />
      )}
      {props.search.item !== undefined && (
        <>
          <Select
            label='Category'
            placeholder='Category'
            data={selectCategories()}
            searchable
            allowDeselect
            {...form.getInputProps('category')}
          />
          <Select
            label='Item'
            placeholder='Item'
            icon={form.values.item && <ThingImage item={+form.values.item} />}
            iconWidth={48}
            itemComponent={ThingsItem}
            data={selectItems(form.values.category!)}
            searchable
            allowDeselect
            {...form.getInputProps('item')}
          />
        </>
      )}
      {props.search.description !== undefined && (
        <Textarea
          label='Description'
          placeholder='Description'
          {...form.getInputProps('description')}
        />
      )}
      {props.search.type !== undefined && (
        <Select
          label='Type'
          placeholder='Type'
          data={[
            { label: 'Negative', value: '-1' },
            { label: 'Positive', value: '1' },
          ]}
          searchable
          allowDeselect
          {...form.getInputProps('type')}
        />
      )}
    </CustomForm>
  );
}

export const openSearchModal = (props: Props) =>
  openModal({
    title: 'Search',
    children: <SearchModal {...props} />,
  });
