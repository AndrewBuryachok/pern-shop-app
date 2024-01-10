import { useTranslation } from 'react-i18next';
import CustomBadge from './CustomBadge';
import { colors } from '../constants';

type Props = {
  color: number;
};

export default function ColorBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <CustomBadge
      color={props.color}
      text={t(`constants.colors.${colors[props.color - 1]}`)}
    />
  );
}
