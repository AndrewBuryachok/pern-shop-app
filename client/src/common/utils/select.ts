import { SmUser } from '../../features/users/user.model';
import { SmCard, SmCardWithBalance } from '../../features/cards/card.model';
import { SmCity } from '../../features/cities/city.model';
import { SmShop } from '../../features/shops/shop.model';
import { SmMarket } from '../../features/markets/market.model';
import {
  SmStorage,
  SmStorageWithPrice,
} from '../../features/storages/storage.model';
import { SelectRent } from '../../features/rents/rent.model';
import { categories, colors, items, kits, roles } from '../../common/constants';

export const selectUsers = (users?: SmUser[]) =>
  users?.map((user) => ({
    ...user,
    status: +user.status,
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
    withPrice: true,
    value: `${storage.id}`,
    label: `${storage.name} (${storage.x} ${storage.y}) ${storage.price}$`,
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
