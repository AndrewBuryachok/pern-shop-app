import SingleText from './SingleText';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { Color } from '../constants';

type Props = {
  fromId: number;
  toId: number;
  sum: number;
};

export default function SumText(props: Props) {
  const user = getCurrentUser();

  const char =
    props.fromId === props.toId
      ? ''
      : user?.id === props.fromId
      ? '-'
      : user?.id === props.toId
      ? '+'
      : '';

  const color =
    props.fromId === props.toId
      ? undefined
      : user?.id === props.fromId
      ? Color.RED
      : user?.id === props.toId
      ? Color.GREEN
      : undefined;

  return <SingleText text={`${char}${props.sum}$`} color={color} />;
}
