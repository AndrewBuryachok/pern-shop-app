import { useTranslation } from 'react-i18next';
import CustomBadge from './CustomBadge';
import { marks } from '../constants';

type Props = {
  mark: number;
};

export default function MarkBadge(props: Props) {
  const [t] = useTranslation();

  return <CustomBadge text={t(`constants.marks.${marks[props.mark - 1]}`)} />;
}
