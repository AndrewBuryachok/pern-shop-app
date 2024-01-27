import { ITableWithActions } from '../../common/interfaces';
import { Rent } from './rent.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewRentAction } from './ViewRentModal';
import { openViewRentThingsAction } from './ViewRentThingsModal';

type Props = ITableWithActions<Rent>;

export default function RentsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={900}
      columns={[
        'renter',
        'owner',
        'market',
        'sum',
        'things',
        'completed',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((rent) => (
        <tr key={rent.id}>
          <td>
            <AvatarWithDoubleText {...rent.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...rent.store.market.card} />
          </td>
          <td>
            <PlaceText {...rent.store.market} container={rent.store.name} />
          </td>
          <td>
            <SumText
              fromId={rent.card.user.id}
              toId={rent.store.market.card.user.id}
              sum={rent.store.market.price}
            />
          </td>
          <td>
            <CustomAnchor
              text={`${rent.things}`}
              open={() => openViewRentThingsAction(rent)}
            />
          </td>
          <td>
            <DateText date={rent.completedAt} />
          </td>
          <td>
            <CustomActions data={rent} actions={[viewRentAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
