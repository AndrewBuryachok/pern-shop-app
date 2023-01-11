import DoubleText from './DoubleText';
import { parseCoordinates } from '../../common/utils';

type Props = {
  name: string;
  x: number;
  y: number;
  container?: number;
};

export default function PlaceText(props: Props) {
  return (
    <DoubleText
      text={`${props.name}` + (props.container ? ' #' + props.container : '')}
      subtext={`${props.x} ${props.y}`}
      color={parseCoordinates(props)}
    />
  );
}
