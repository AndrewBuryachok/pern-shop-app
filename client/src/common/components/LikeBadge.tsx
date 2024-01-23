import { useTranslation } from 'react-i18next';
import CustomBadge from './CustomBadge';
import { Color } from '../constants';

type Props = {
  type: boolean;
};

export default function LikeBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <CustomBadge
      color={props.type ? Color.GREEN : Color.RED}
      text={props.type ? t('constants.like') : t('constants.dislike')}
    />
  );
}
