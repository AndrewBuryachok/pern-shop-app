import { t } from 'i18next';
import { MdCard } from '../../features/cards/card.model';
import { Place } from '../../features/places/place.model';
import { MdStore } from '../../features/stores/store.model';
import { MdCell } from '../../features/cells/cell.model';
import { MdDrawer } from '../../features/drawers/drawer.model';
import { SmTradeWithoutPrice } from '../../features/trades/trade.model';
import { SmSaleWithoutPrice } from '../../features/sales/sale.model';
import { Color, items, kits, statuses } from '../constants';

type Coordinates = {
  x: number;
  y: number;
};

export const parseCoordinates = ({ x, y }: Coordinates) =>
  Math.abs(x) <= Math.abs(y)
    ? y >= 0
      ? Color.GREEN
      : Color.BLUE
    : x >= 0
    ? Color.RED
    : Color.YELLOW;

export const parseDate = (date: Date) => ({
  date: new Date(date).toLocaleDateString('uk'),
  time: new Date(date).toLocaleTimeString('uk'),
});

export const parseTime = (date?: Date) => {
  if (!date) return '-';
  const result = parseDate(date);
  return `${result.date} ${result.time}`;
};

export const parseCard = (card: MdCard) => `${card.user.nick} - ${card.name}`;

export const parsePlace = (place: Place) =>
  `${place.name} (${place.x} ${place.y})`;

export const parseStore = (store: MdStore) =>
  `${parsePlace(store.market)} #${store.name}`;

export const parseCell = (cell: MdCell) =>
  `${parsePlace(cell.storage)} #${cell.name}`;

export const parseDrawer = (drawer: MdDrawer) =>
  `${parsePlace(drawer.station)} #${drawer.name}`;

export const parseItem = (item: number) =>
  t(`constants.items.${items[item - 1].split(': ')[1]}`);

export const parseThingAmount = (data: {
  amount: number;
  intake: number;
  kit: number;
}) =>
  `${data.amount} * ${data.intake} ${t(
    `constants.kits.${kits[data.kit - 1]}`,
  )}`;

export const parseTradeAmount = (trade: SmTradeWithoutPrice) =>
  `${trade.amount} * ${trade.ware.intake} ${t(
    `constants.kits.${kits[trade.ware.kit - 1]}`,
  )}`;

export const parseSaleAmount = (sale: SmSaleWithoutPrice) =>
  `${sale.amount} * ${sale.product.intake} ${t(
    `constants.kits.${kits[sale.product.kit - 1]}`,
  )}`;

export const parseStatus = (status: number) =>
  t(`constants.statuses.${statuses[status - 1]}`);
