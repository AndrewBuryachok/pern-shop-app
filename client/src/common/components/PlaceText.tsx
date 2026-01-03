import DoubleText from './DoubleText';
import { parseCoordinates } from '../../common/utils';

type Props = {
  name: string;
  x: number;
  y: number;
};

export default function PlaceText(props: Props) {
  return (
    <DoubleText
      text={props.name}
      subtext={`${props.x} ${props.y}`}
      color={parseCoordinates(props)}
    />
  );
}
