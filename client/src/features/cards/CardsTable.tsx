import { ITableWithActions } from '../../common/interfaces';
import { Card } from './card.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import DoubleText from '../../common/components/DoubleText';
import ColorBadge from '../../common/components/ColorBadge';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { viewCardAction } from './ViewCardModal';
import { colors } from '../../common/constants';

type Props = ITableWithActions<Card>;

export default function CardsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={600}
      columns={['Owner', 'Card', 'Color', 'Balance', 'Action']}
      {...props}
    >
      {props.data?.result.map((card) => (
        <tr key={card.id}>
          <td>
            <AvatarWithSingleText id={card.user.id} name={card.user.name} />
          </td>
          <td>
            <DoubleText
              text={card.name}
              subtext={colors[card.color - 1]}
              color={card.color}
            />
          </td>
          <td>
            <ColorBadge color={colors[card.color - 1]} />
          </td>
          <td>
            <SingleText text={`${card.balance}$`} />
          </td>
          <td>
            <CustomActions data={card} actions={[viewCardAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
