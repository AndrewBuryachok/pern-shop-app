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

type Props = { value: string; label: string }[];

export const customSelect = (data?: Props) =>
  [{ value: '', label: '' }].concat(data || []);

export const selectUsers = (users?: SmUser[]) =>
  customSelect(
    users?.map((user) => ({
      value: `${user.id}`,
      label: user.name,
    })),
  );

export const selectCards = (cards?: SelectCard[]) =>
  customSelect(
    cards?.map((card) => ({
      value: `${card.id}`,
      label: card.name,
    })),
  );

export const selectCardsWithBalance = (cards?: SelectCardWithBalance[]) =>
  customSelect(
    cards?.map((card) => ({
      value: `${card.id}`,
      label: `${card.name} (${card.balance}$)`,
    })),
  );

export const selectCities = (cities?: SmCity[]) =>
  customSelect(
    cities?.map((city) => ({
      value: `${city.id}`,
      label: `${city.name} (${city.x} ${city.y})`,
    })),
  );

export const selectShops = (shops?: SmShop[]) =>
  customSelect(
    shops?.map((shop) => ({
      value: `${shop.id}`,
      label: `${shop.name} (${shop.x} ${shop.y})`,
    })),
  );

export const selectMarkets = (markets?: SelectMarket[]) =>
  customSelect(
    markets?.map((market) => ({
      value: `${market.id}`,
      label: `${market.name} (${market.x} ${market.y})`,
    })),
  );

export const selectStorages = (storages?: SelectStorage[]) =>
  customSelect(
    storages?.map((storage) => ({
      value: `${storage.id}`,
      label: `${storage.name} (${storage.x} ${storage.y})`,
    })),
  );

export const selectStoragesWithPrice = (storages?: SelectStorageWithPrice[]) =>
  customSelect(
    storages?.map((storage) => ({
      value: `${storage.id}`,
      label: `${storage.name} (${storage.x} ${storage.y}) (${storage.price}$)`,
    })),
  );

export const selectRents = (rents?: SelectRent[]) =>
  customSelect(
    rents?.map((rent) => ({
      value: `${rent.id}`,
      label: `${rent.store.market.name} (${rent.store.market.x} ${rent.store.market.y}) #${rent.store.name}`,
    })),
  );

export const selectRoles = () =>
  customSelect(
    roles.map((role, index) => ({ value: `${index + 1}`, label: role })),
  );

export const selectColors = () =>
  customSelect(
    colors.map((color, index) => ({ value: `${index + 1}`, label: color })),
  );

export const selectTypes = () =>
  customSelect(
    ['reduce', 'increase'].map((type, index) => ({
      value: `${index}`,
      label: type,
    })),
  );

export const selectCategories = () =>
  customSelect(
    categories.map((category, index) => ({
      value: `${index + 1}`,
      label: category,
    })),
  );

export const selectItems = () =>
  [{ value: '', label: '', category: '' }].concat(
    items.map((item, index) => ({
      value: `${index + 1}`,
      label: item.substring(3),
      category: item[0],
    })),
  );

export const selectKits = () =>
  customSelect(
    kits.map((kit, index) => ({ value: `${index + 1}`, label: kit })),
  );
