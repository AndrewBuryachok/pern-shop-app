import { t } from 'i18next';
import { MdCard } from '../../features/cards/card.model';
import { SmPlace } from '../../features/places/place.model';
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

export const parseItem = (item: string) => t(`constants.items.${item}`);

export const parseThingAmount = (data: {
  amount: number;
  intake: number;
  kit: number;
}) => `${data.amount} * ${data.intake} ${parseThingKit(data.kit)}`;

export const parseThingKit = (kit: number) =>
  t(`constants.kits.${kits[kit - 1]}`);

export const parsePurchaseAmount = (purchase: SmPurchaseWithoutPrice) =>
  `${purchase.amount} * ${purchase.good.intake} ${parseThingKit(purchase.good.kit)}`;

export const parseStatus = (status: number) =>
  t(`constants.statuses.${statuses[status - 1]}`);
