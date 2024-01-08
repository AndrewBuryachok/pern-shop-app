import { t } from 'i18next';
import { SmUser } from '../../features/users/user.model';
import { MdCard, MdCardWithBalance } from '../../features/cards/card.model';
import { SmCity } from '../../features/cities/city.model';
import { SmShop } from '../../features/shops/shop.model';
import { SmMarket } from '../../features/markets/market.model';
import {
  SmStorage,
  SmStorageWithPrice,
} from '../../features/storages/storage.model';
import { Container } from '../../features/containers/container.model';
import { SelectRent } from '../../features/rents/rent.model';
import {
  backgrounds,
  categories,
  colors,
  items,
  kinds,
  kits,
  priorities,
  results,
  resultsToColors,
  roles,
  statuses,
} from '../constants';

export const selectUsers = (users?: SmUser[]) =>
  users?.map((user) => ({
    ...user,
    userid: user.id,
    nick: user.nick,
    value: `${user.id}`,
    label: user.nick,
  })) || [];

export const selectCards = (cards?: MdCard[]) =>
  cards?.map(({ user, ...card }) => ({
    ...card,
    userid: user.id,
    nick: user.nick,
    avatar: user.avatar,
    color: `${card.color}`,
    value: `${card.id}`,
    label: card.name,
  })) || [];

export const selectCardsWithBalance = (cards?: MdCardWithBalance[]) =>
  cards?.map(({ user, ...card }) => ({
    ...card,
    userid: user.id,
    nick: user.nick,
    avatar: user.avatar,
    color: `${card.color}`,
    value: `${card.id}`,
    label: `${card.name} ${card.balance}$`,
  })) || [];

export const selectCities = (cities?: SmCity[]) =>
  cities?.map((city) => ({
    ...city,
    value: `${city.id}`,
    label: `${city.name} (${city.x} ${city.y})`,
  })) || [];

export const selectShops = (shops?: SmShop[]) =>
  shops?.map((shop) => ({
    ...shop,
    value: `${shop.id}`,
    label: `${shop.name} (${shop.x} ${shop.y})`,
  })) || [];

export const selectMarkets = (markets?: SmMarket[]) =>
  markets?.map((market) => ({
    ...market,
    value: `${market.id}`,
    label: `${market.name} (${market.x} ${market.y})`,
  })) || [];

export const selectStorages = (storages?: SmStorage[]) =>
  storages?.map((storage) => ({
    ...storage,
    value: `${storage.id}`,
    label: `${storage.name} (${storage.x} ${storage.y})`,
  })) || [];

export const selectStoragesWithPrice = (storages?: SmStorageWithPrice[]) =>
  storages?.map((storage) => ({
    ...storage,
    value: `${storage.id}`,
    label: `${storage.name} (${storage.x} ${storage.y}) ${storage.price}$`,
  })) || [];

export const selectContainers = (containers?: Container[]) =>
  containers?.map((container) => ({
    value: `${container.id}`,
    label: `#${container.name}`,
  })) || [];

export const selectRents = (rents?: SelectRent[]) =>
  rents?.map((rent) => ({
    ...rent.store.market,
    container: rent.store.name,
    value: `${rent.id}`,
    label: `${rent.store.market.name} (${rent.store.market.x} ${rent.store.market.y}) #${rent.store.name}`,
  })) || [];

export const selectBackgrounds = () =>
  backgrounds.map((bakground, index) => ({
    value: `${index + 1}`,
    label: t('constants.backgrounds.' + bakground),
  }));

export const selectRoles = () =>
  roles.map((role, index) => ({
    text: t('constants.roles.' + role),
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: t('constants.roles.' + role),
  }));

export const selectColors = () =>
  colors.map((color, index) => ({
    text: t('constants.colors.' + color),
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: t('constants.colors.' + color),
  }));

export const searchTypes = () =>
  selectColors()
    .filter((color) => +color.value % 2)
    .map((color, index) => ({
      ...color,
      value: `${index * 2 - 1}`,
    }));

export const selectExchangeTypes = () =>
  ['decrease', 'increase'].map((type, index) => ({
    text: t('constants.' + type),
    color: `${index * 2 + 1}`,
    value: `${index}`,
    label: t('constants.' + type),
  }));

export const selectVoteTypes = () =>
  ['down', 'up'].map((type, index) => ({
    text: t('constants.' + type),
    color: `${index * 2 + 1}`,
    value: `${index}`,
    label: t('constants.' + type),
  }));

export const selectCategories = () =>
  categories.map((category, index) => ({
    value: `${index}`,
    label: t('constants.categories.' + category),
  }));

export const selectItems = (category: string) =>
  items
    .map((item, index) => ({
      item: index + 1,
      category: item.split(': ')[0],
      group: t('constants.categories.' + categories[+item.split(': ')[0][0]]),
      value: `${index + 1}`,
      label: t('constants.items.' + item.split(': ')[1]),
    }))
    .filter((item) => item.category.includes(category || ''));

export const selectKits = () =>
  kits.map((kit, index) => ({
    value: `${index + 1}`,
    label: t('constants.kits.' + kit),
  }));

export const selectKinds = () =>
  kinds.map((kind, index) => ({
    text: t('constants.kinds.' + kind),
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: t('constants.kinds.' + kind),
  }));

export const selectPriorities = () =>
  priorities.map((priority, index) => ({
    priority: index + 1,
    value: `${index + 1}`,
    label: t('constants.priorities.' + priority),
  }));

export const selectStatuses = () =>
  statuses.map((status, index) => ({
    text: t('constants.statuses.' + status),
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: t('constants.statuses.' + status),
  }));

export const selectResults = () =>
  results.map((result, index) => ({
    text: t('constants.results.' + result),
    color: `${resultsToColors[index]}`,
    value: `${index + 1}`,
    label: t('constants.results.' + result),
  }));
