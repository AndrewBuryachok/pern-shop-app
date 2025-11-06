import { t } from 'i18next';
import { SmUser } from '../../features/users/user.model';
import { LgCard, LgCardWithBalance } from '../../features/cards/card.model';
import { SmTown } from '../../features/towns/town.model';
import { SmFarm } from '../../features/farms/farm.model';
import { SmShop } from '../../features/shops/shop.model';
import { SmMarket } from '../../features/markets/market.model';
import { SmStorage } from '../../features/storages/storage.model';
import {
  SmStation,
  SmStationWithPrice,
} from '../../features/stations/station.model';
import { SmTag } from '../../features/tags/tag.model';
import { Container } from '../../features/containers/container.model';
import { SelectRent } from '../../features/rents/rent.model';
import { SelectLease } from '../../features/leases/lease.model';
import { SmPurchaseWithPrice } from '../../features/purchases/purchase.model';
import { parseItem, parsePlace } from './parse.util';
import {
  backgrounds,
  colors,
  items,
  kits,
  marks,
  results,
  resultsToColors,
  Role,
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

export const selectFarms = (farms?: SmFarm[]) =>
  farms?.map((farm) => ({
    ...farm,
    value: `${farm.id}`,
    label: parsePlace(farm),
  })) || [];

export const selectShops = (shops?: SmShop[]) =>
  shops?.map((shop) => ({
    ...shop,
    value: `${shop.id}`,
    label: parsePlace(shop),
  })) || [];

export const selectMarkets = (markets?: SmMarket[]) =>
  markets?.map((market) => ({
    ...market,
    value: `${market.id}`,
    label: parsePlace(market),
  })) || [];

export const selectStorages = (storages?: SmStorage[]) =>
  storages?.map((storage) => ({
    ...storage,
    value: `${storage.id}`,
    label: parsePlace(storage),
  })) || [];

export const selectStations = (stations?: SmStation[]) =>
  stations?.map((station) => ({
    ...station,
    value: `${station.id}`,
    label: parsePlace(station),
  })) || [];

export const selectStationsWithPrice = (stations?: SmStationWithPrice[]) =>
  stations?.map((station) => ({
    ...station,
    value: `${station.id}`,
    label: `${parsePlace(station)} ${station.price} ${t('constants.currency')}`,
    group: `${station.price} ${t('constants.currency')}`,
  })) || [];

export const selectTags = (tags?: SmTag[]) =>
  tags?.map((tag) => ({
    value: `${tag.id}`,
    label: `${tag.name} ${tag.price} ${t('constants.currency')}`,
  })) || [];

export const selectContainers = (containers?: Container[]) =>
  containers?.map((container) => ({
    value: `${container.id}`,
    label: `#${container.name}`,
  })) || [];

export const selectRents = (rents?: SelectRent[]) =>
  rents?.map((rent) => ({
    ...rent.stall.market,
    container: rent.stall.name,
    value: `${rent.id}`,
    label: `${parsePlace(rent.stall.market)} #${rent.stall.name}`,
  })) || [];

export const selectLeases = (leases?: SelectLease[]) =>
  leases?.map((lease) => ({
    ...lease.cell.storage,
    container: lease.cell.name,
    value: `${lease.id}`,
    label: `${parsePlace(lease.cell.storage)} #${lease.cell.name}`,
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

export const selectExchangeTypes = () =>
  ['decrease', 'increase'].map((type, index) => ({
    text: t(`constants.${type}`),
    color: `${index * 2 + 1}`,
    value: `${index}`,
    label: t(`constants.${type}`),
  }));

export const selectPollTypes = () =>
  ['rejected', 'accepted'].map((type, index) => ({
    text: t(`constants.results.${type}`),
    color: `${index * 2 + 1}`,
    value: `${index}`,
    label: t(`constants.results.${type}`),
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

export const selectMarks = () =>
  marks.map((mark, index) => ({
    value: `${index + 1}`,
    label: t(`constants.marks.${mark}`),
  }));

export const selectResults = () =>
  results.map((result, index) => ({
    text: t(`constants.results.${result}`),
    color: `${resultsToColors[index]}`,
    value: `${index + 1}`,
    label: t(`constants.results.${result}`),
  }));
