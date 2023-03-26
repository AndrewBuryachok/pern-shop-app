import DoubleText from './DoubleText';
import { parseCoordinates } from '../../common/utils';

type Props = {
  name: string;
  x: number;
  y: number;
  container?: number;
  price?: number;
  withPrice?: boolean;
};

export default function PlaceText(props: Props) {
  return (
    <DoubleText
      text={`${props.name}${props.container ? ` #${props.container}` : ''}${
        props.withPrice && props.price ? ` ${props.price}$` : ''
      }`}
      subtext={`${props.x} ${props.y}`}
      color={parseCoordinates(props)}
    />
  );
}
