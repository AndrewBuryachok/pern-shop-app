import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Card } from './card.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import CustomBadge from '../../common/components/CustomBadge';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewCardAction } from './ViewCardModal';
import { colors } from '../../common/constants';

type Props = ITableWithActions<Card>;

export default function CardsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={700}
      columns={[
        t('columns.owner'),
        t('columns.card'),
        t('columns.color'),
        t('columns.balance'),
        t('columns.users'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((card) => (
        <tr key={card.id}>
          <td>
            <AvatarWithSingleText {...card.user} />
          </td>
          <td>
            <SingleText text={card.name} color={card.color} />
          </td>
          <td>
            <CustomBadge
              color={card.color}
              text={t('constants.colors.' + colors[card.color - 1])}
            />
          </td>
          <td>
            <SingleText text={`${card.balance}$`} />
          </td>
          <td>
            <TotalText data={card.users.length} />
          </td>
          <td>
            <CustomActions data={card} actions={[viewCardAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
