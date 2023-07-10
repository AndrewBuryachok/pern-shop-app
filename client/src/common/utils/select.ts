import { SmUserWithCity } from '../../features/users/user.model';
import { SmCard, SmCardWithBalance } from '../../features/cards/card.model';
import { SmCityWithUser } from '../../features/cities/city.model';
import { SmShopWithUser } from '../../features/shops/shop.model';
import { SmMarketWithCard } from '../../features/markets/market.model';
import {
  SmStorageWithCard,
  SmStorageWithPrice,
} from '../../features/storages/storage.model';
import { Container } from '../../features/containers/container.model';
import { SelectRent } from '../../features/rents/rent.model';
import {
  categories,
  colors,
  items,
  kits,
  priorities,
  roles,
  statuses,
} from '../../common/constants';

export const selectUsers = (users?: SmUserWithCity[]) =>
  users?.map(({ cityId, ...user }) => ({
    ...user,
    status: +user.status,
    city: cityId,
    value: `${user.id}`,
    label: user.name,
  })) || [];

export const selectCards = (cards?: SmCard[]) =>
  cards?.map((card) => ({
    ...card,
    color: `${card.color}`,
    value: `${card.id}`,
    label: card.name,
  })) || [];

export const selectCardsWithBalance = (cards?: SmCardWithBalance[]) =>
  cards?.map((card) => ({
    ...card,
    color: `${card.color}`,
    value: `${card.id}`,
    label: `${card.name} ${card.balance}$`,
  })) || [];

export const selectCities = (cities?: SmCityWithUser[]) =>
  cities?.map(({ userId, ...city }) => ({
    ...city,
    user: userId,
    value: `${city.id}`,
    label: `${city.name} (${city.x} ${city.y})`,
  })) || [];

export const selectShops = (shops?: SmShopWithUser[]) =>
  shops?.map(({ userId, ...shop }) => ({
    ...shop,
    user: userId,
    value: `${shop.id}`,
    label: `${shop.name} (${shop.x} ${shop.y})`,
  })) || [];

export const selectMarkets = (markets?: SmMarketWithCard[]) =>
  markets?.map(({ cardId, ...market }) => ({
    ...market,
    card: cardId,
    value: `${market.id}`,
    label: `${market.name} (${market.x} ${market.y})`,
  })) || [];

export const selectStorages = (storages?: SmStorageWithCard[]) =>
  storages?.map(({ cardId, ...storage }) => ({
    ...storage,
    card: cardId,
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

export const selectRoles = () =>
  roles.map((role, index) => ({
    text: role,
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: role,
  }));

export const selectColors = () =>
  colors.map((color, index) => ({
    text: color,
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: color,
  }));

export const selectTypes = () =>
  ['decrease', 'increase'].map((type, index) => ({
    value: `${index}`,
    label: type,
  }));

export const selectCategories = () =>
  categories.map((category, index) => ({
    value: `${index + 1}`,
    label: category,
  }));

export const selectItems = (category: string) =>
  items
    .map((item, index) => ({
      item: index + 1,
      category: item[0],
      value: `${index + 1}`,
      label: item.substring(3),
    }))
    .filter((item) => item.category === category);

export const selectKits = () =>
  kits.map((kit, index) => ({ value: `${index + 1}`, label: kit }));

export const selectStatuses = () =>
  statuses.map((status, index) => ({
    text: status,
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: status,
  }));

export const selectPriorities = () =>
  priorities.map((priority, index) => ({
    priority: index + 1,
    value: `${index + 1}`,
    label: priority,
  }));
