import { SmUser } from '../../features/users/user.model';
import {
  SelectCard,
  SelectCardWithBalance,
} from '../../features/cards/card.model';
import { SmCity } from '../../features/cities/city.model';
import { SmShop } from '../../features/shops/shop.model';
import { SelectMarket } from '../../features/markets/market.model';
import {
  SelectStorage,
  SelectStorageWithPrice,
} from '../../features/storages/storage.model';
import { SelectRent } from '../../features/rents/rent.model';
import { categories, colors, items, kits, roles } from '../../common/constants';

export const selectUsers = (users?: SmUser[]) =>
  users?.map((user) => ({
    name: user.name,
    value: `${user.id}`,
    label: user.name,
  })) || [];

export const selectCards = (cards?: SelectCard[]) =>
  cards?.map((card) => ({
    value: `${card.id}`,
    label: card.name,
  })) || [];

export const selectCardsWithBalance = (cards?: SelectCardWithBalance[]) =>
  cards?.map((card) => ({
    value: `${card.id}`,
    label: `${card.name} (${card.balance}$)`,
  })) || [];

export const selectCities = (cities?: SmCity[]) =>
  cities?.map((city) => ({
    value: `${city.id}`,
    label: `${city.name} (${city.x} ${city.y})`,
  })) || [];

export const selectShops = (shops?: SmShop[]) =>
  shops?.map((shop) => ({
    value: `${shop.id}`,
    label: `${shop.name} (${shop.x} ${shop.y})`,
  })) || [];

export const selectMarkets = (markets?: SelectMarket[]) =>
  markets?.map((market) => ({
    value: `${market.id}`,
    label: `${market.name} (${market.x} ${market.y})`,
  })) || [];

export const selectStorages = (storages?: SelectStorage[]) =>
  storages?.map((storage) => ({
    value: `${storage.id}`,
    label: `${storage.name} (${storage.x} ${storage.y})`,
  })) || [];

export const selectStoragesWithPrice = (storages?: SelectStorageWithPrice[]) =>
  storages?.map((storage) => ({
    value: `${storage.id}`,
    label: `${storage.name} (${storage.x} ${storage.y}) (${storage.price}$)`,
  })) || [];

export const selectRents = (rents?: SelectRent[]) =>
  rents?.map((rent) => ({
    value: `${rent.id}`,
    label: `${rent.store.market.name} (${rent.store.market.x} ${rent.store.market.y}) #${rent.store.name}`,
  })) || [];

export const selectRoles = () =>
  roles.map((role, index) => ({ value: `${index + 1}`, label: role }));

export const selectColors = () =>
  colors.map((color, index) => ({ value: `${index + 1}`, label: color }));

export const selectTypes = () =>
  ['reduce', 'increase'].map((type, index) => ({
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
      value: `${index + 1}`,
      label: item.substring(3),
      category: item[0],
    }))
    .filter((item) => item.category === category);

export const selectKits = () =>
  kits.map((kit, index) => ({ value: `${index + 1}`, label: kit }));
