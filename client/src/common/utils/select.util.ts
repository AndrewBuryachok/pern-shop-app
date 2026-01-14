import { t } from 'i18next';
import { SmUser } from '../../features/users/user.model';
import { LgCard, LgCardWithBalance } from '../../features/cards/card.model';
import { SmTown } from '../../features/towns/town.model';
import { SmShop } from '../../features/shops/shop.model';
import { SmStation } from '../../features/stations/station.model';
import { SmPurchaseWithPrice } from '../../features/purchases/purchase.model';
import { parseItem, parsePlace } from './parse.util';
import { backgrounds, colors, items, kits, Role, statuses } from '../constants';

export const selectUsers = (users?: SmUser[]) =>
  users?.map((user) => ({
    ...user,
    userid: user.id,
    nick: user.nick,
    value: `${user.id}`,
    label: user.nick,
  })) || [];

export const selectCards = (cards?: LgCard[]) =>
  cards?.map(({ account: { user, ...account }, ...card }) => ({
    ...account,
    userid: user.id,
    nick: user.nick,
    avatar: user.avatar,
    color: `${account.color}`,
    value: `${card.id}`,
    label: account.name,
  })) || [];

export const selectCardsWithBalance = (cards?: LgCardWithBalance[]) =>
  cards?.map(({ account: { user, ...account }, ...card }) => ({
    ...account,
    userid: user.id,
    nick: user.nick,
    avatar: user.avatar,
    color: `${account.color}`,
    value: `${card.id}`,
    label: `${account.name} ${account.balance} ${t('constants.currency')}`,
  })) || [];

export const selectTowns = (towns?: SmTown[]) =>
  towns?.map((town) => ({
    ...town,
    value: `${town.id}`,
    label: parsePlace(town),
  })) || [];

export const selectShops = (shops?: SmShop[]) =>
  shops?.map((shop) => ({
    ...shop,
    value: `${shop.id}`,
    label: parsePlace(shop),
  })) || [];

export const selectStations = (stations?: SmStation[]) =>
  stations?.map((station) => ({
    ...station,
    value: `${station.id}`,
    label: parsePlace(station),
  })) || [];

export const selectPurchases = (purchases?: SmPurchaseWithPrice[]) =>
  purchases?.map(({ good, ...purchase }) => ({
    ...good,
    ...purchase,
    value: `${purchase.id}`,
    label: parseItem(good.item),
  })) || [];

export const selectBackgrounds = () =>
  backgrounds.map((background, index) => ({
    value: `${index + 1}`,
    label: t(`constants.backgrounds.${background}`),
  }));

export const selectRoles = () =>
  Object.values(Role).map((role) => ({
    role,
    value: role,
    label: t(`constants.roles.${role}`),
  }));

export const selectColors = () =>
  colors.map((color, index) => ({
    text: t(`constants.colors.${color}`),
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: t(`constants.colors.${color}`),
  }));

export const searchTypes = () =>
  selectColors()
    .filter((color) => +color.value % 2)
    .map((color, index) => ({
      ...color,
      value: `${index * 2 - 1}`,
    }));

export const selectItems = () =>
  items.map((item) => ({
    item: item,
    value: item,
    label: t(`constants.items.${item}`),
  }));

export const selectKits = () =>
  kits.map((kit, index) => ({
    value: `${index + 1}`,
    label: t(`constants.kits.${kit}`),
  }));

export const selectStatuses = () =>
  statuses.map((status, index) => ({
    text: t(`constants.statuses.${status}`),
    color: `${index + 1}`,
    value: `${index + 1}`,
    label: t(`constants.statuses.${status}`),
  }));

export const selectDeliveries = () =>
  ['without', 'with'].map((delivery, index) => ({
    value: `${index}`,
    label: t(`constants.deliveries.${delivery}`),
  }));
