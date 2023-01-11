import DoubleText from './DoubleText';
import { parseDate } from '../../common/utils';

type Props = {
  date: Date;
};

export default function DateText(props: Props) {
  const { date, time } = parseDate(props.date);

  return <DoubleText text={date} subtext={time} />;
}
