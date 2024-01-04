import { useTranslation } from 'react-i18next';
import { Vote } from '../../features/polls/vote.model';
import CustomBadge from './CustomBadge';
import { Color } from '../constants';

type Props = {
  vote: Vote;
};

export default function VoteBadge(props: Props) {
  const [t] = useTranslation();

  return (
    <CustomBadge
      color={props.vote.type ? Color.GREEN : Color.RED}
      text={props.vote.type ? t('constants.up') : t('constants.down')}
    />
  );
}
