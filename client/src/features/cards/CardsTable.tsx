import { ITableWithActions } from '../../common/interfaces';
import { Card } from './card.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import ColorBadge from '../../common/components/ColorBadge';
import CustomActions from '../../common/components/CustomActions';
import { viewCardAction } from './ViewCardModal';

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
            <AvatarWithSingleText {...card.user} />
          </td>
          <td>
            <SingleText text={card.name} color={card.color} />
          </td>
          <td>
            <ColorBadge color={card.color} />
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
