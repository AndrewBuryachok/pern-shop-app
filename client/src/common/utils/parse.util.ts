import { t } from 'i18next';
import { MdCard } from '../../features/cards/card.model';
import { SmPlace } from '../../features/places/place.model';
import { MdStall } from '../../features/stalls/stall.model';
import { MdCell } from '../../features/cells/cell.model';
import { SmPurchaseWithoutPrice } from '../../features/purchases/purchase.model';
import { Color, kits, statuses } from '../constants';

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

export const parseCard = (card: MdCard) =>
  `${card.user.nick} - ${card.account.name}`;

export const parsePlace = (place: SmPlace) =>
  `${place.name} (${place.x} ${place.y})`;

export const parseStall = (stall: MdStall) =>
  `${parsePlace(stall.market)} #${stall.name}`;

export const parseCell = (cell: MdCell) =>
  `${parsePlace(cell.storage)} #${cell.name}`;

export const parseItem = (item: string) => t(`constants.items.${item}`);

export const parseThingAmount = (data: {
  amount: number;
  intake: number;
  kit: number;
}) =>
  `${data.amount} * ${data.intake} ${t(
    `constants.kits.${kits[data.kit - 1]}`,
  )}`;

export const parsePurchaseAmount = (purchase: SmPurchaseWithoutPrice) =>
  `${purchase.amount} * ${purchase.good.intake} ${t(
    `constants.kits.${kits[purchase.good.kit - 1]}`,
  )}`;

export const parseStatus = (status: number) =>
  t(`constants.statuses.${statuses[status - 1]}`);
