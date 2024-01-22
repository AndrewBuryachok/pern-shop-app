import { ITableWithActions } from '../../common/interfaces';
import { Card } from './card.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewCardAction } from './ViewCardModal';

type Props = ITableWithActions<Card>;

export default function CardsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'card', 'balance', 'created', 'users', 'action']}
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
            <PriceText price={card.balance} />
          </td>
          <td>
            <DateText date={card.createdAt} />
          </td>
          <td>
            <TotalText data={card.users} />
          </td>
          <td>
            <CustomActions data={card} actions={[viewCardAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
