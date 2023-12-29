import { useTranslation } from 'react-i18next';
import CustomBadge from './CustomBadge';
import { results, resultsToColors } from '../constants';

type Props = {
  result: number;
};

export default function ResultBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <CustomBadge
      color={resultsToColors[props.result - 1]}
      text={t('constants.results.' + results[props.result - 1])}
    />
  );
}
