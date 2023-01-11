import SingleText from './SingleText';
import { Color } from '../constants';

type Props = {
  myId: number;
  fromId: number;
  toId: number;
  sum: number;
};

export default function SumText(props: Props) {
  const char =
    props.fromId === props.toId
      ? ''
      : props.myId === props.fromId
      ? '-'
      : props.myId === props.toId
      ? '+'
      : '';
  const color =
    props.fromId === props.toId
      ? undefined
      : props.myId === props.fromId
      ? Color.RED
      : props.myId === props.toId
      ? Color.GREEN
      : undefined;

  return <SingleText text={`${char}${props.sum}$`} color={color} />;
}
