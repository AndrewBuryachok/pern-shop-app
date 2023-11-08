import { useTranslation } from 'react-i18next';
import SingleText from './SingleText';

type Props = {
  data: number;
};

export default function TotalText(props: Props) {
  const [t] = useTranslation();

  return <SingleText text={`${t('components.total')}: ${props.data}`} />;
}
