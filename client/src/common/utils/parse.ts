import i18next from 'i18next';
import { t } from 'i18next';
import { MdCard } from '../../features/cards/card.model';
import { Place } from '../../features/places/place.model';
import { MdStore } from '../../features/stores/store.model';
import { MdCell } from '../../features/cells/cell.model';
import { Trade } from '../../features/trades/trade.model';
import { Sale } from '../../features/sales/sale.model';
import { items, kinds, kits, statuses } from '../constants';

type Coordinates = {
  x: number;
  y: number;
};

export const parseCoordinates = ({ x, y }: Coordinates) =>
  Math.abs(x) <= Math.abs(y) ? (y >= 0 ? 1 : 2) : x >= 0 ? 3 : 4;

export const parseDate = (date: Date) => ({
  date: new Date(date).toLocaleDateString(i18next.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
  time: new Date(date).toLocaleTimeString(i18next.language),
});

export const parseTime = (date?: Date) => {
  if (!date) return '-';
  const result = parseDate(date);
  return `${result.date} ${result.time}`;
};

export const parseCard = (card: MdCard) => `${card.user.name} - ${card.name}`;

export const parsePlace = (place: Place) =>
  `${place.name} (${place.x} ${place.y})`;

export const parseStore = (store: MdStore) =>
  `${parsePlace(store.market)} #${store.name}`;

export const parseCell = (cell: MdCell) =>
  `${parsePlace(cell.storage)} #${cell.name}`;

export const parseItem = (item: number) =>
  t('constants.items.' + items[item - 1].split(': ')[1]);

export const parseThingAmount = (data: {
  amount: number;
  intake: number;
  kit: number;
}) =>
  `${data.amount} * ${data.intake} ${t(
    'constants.kits.' + kits[data.kit - 1],
  )}`;

export const parseTradeAmount = (trade: Trade) =>
  `${trade.amount} * ${trade.ware.intake} ${kits[trade.ware.kit - 1]}`;

export const parseSaleAmount = (sale: Sale) =>
  `${sale.amount} * ${sale.product.intake} ${kits[sale.product.kit - 1]}`;

export const parseKind = (kind: number) =>
  t('constants.kinds.' + kinds[kind - 1]);

export const parseStatus = (status: number) =>
  t('constants.statuses.' + statuses[status - 1]);
