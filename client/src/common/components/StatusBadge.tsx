import CustomBadge from './CustomBadge';
import { parseStatus } from '../utils';

type Props = {
  status: number;
};

export default function StatusBadge(props: Props) {
  return <CustomBadge color={props.status} text={parseStatus(props.status)} />;
}
