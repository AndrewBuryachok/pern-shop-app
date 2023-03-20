import { ITableWithActions } from '../../common/interfaces';
import { Rent } from './rent.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewRentAction } from './ViewRentModal';

type Props = ITableWithActions<Rent>;

export default function RentsTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={800}
      columns={[
        'Renter',
        'Lessor',
        'Market',
        'Sum',
        'Created',
        'Wares',
        'Action',
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
              myId={user.id}
              fromId={rent.card.user.id}
              toId={rent.store.market.card.user.id}
              sum={rent.store.market.price}
            />
          </td>
          <td>
            <DateText date={rent.createdAt} />
          </td>
          <td>
            <TotalText data={rent.wares.length} />
          </td>
          <td>
            <CustomActions data={rent} actions={[viewRentAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
