import { t } from 'i18next';
import DoubleText from './DoubleText';
import { parseCoordinates } from '../../common/utils';

type Props = {
  name: string;
  x: number;
  y: number;
  container?: number;
  price?: number;
  withoutPrice?: true;
};

export default function PlaceText(props: Props) {
  return (
    <DoubleText
      text={`${props.name}${props.container ? ` #${props.container}` : ''}${
        !props.container && props.price && !props.withoutPrice
          ? ` ${props.price} ${t('constants.currency')}`
          : ''
      }`}
      subtext={`${props.x} ${props.y}`}
      color={parseCoordinates(props)}
    />
  );
}
