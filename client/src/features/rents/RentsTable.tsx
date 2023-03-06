import { ITableWithActions } from '../../common/interfaces';
import { Rent } from './rent.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import CustomSelect from '../../common/components/CustomSelect';
import CustomActions from '../../common/components/CustomActions';
import { viewRentAction } from './ViewRentModal';
import { viewThings } from '../../common/utils';

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
            <AvatarWithDoubleText
              id={rent.card.user.id}
              name={rent.card.user.name}
              text={rent.card.name}
              color={rent.card.color}
            />
          </td>
          <td>
            <AvatarWithDoubleText
              id={rent.store.market.card.user.id}
              name={rent.store.market.card.user.name}
              text={rent.store.market.card.name}
              color={rent.store.market.card.color}
            />
          </td>
          <td>
            <PlaceText
              name={rent.store.market.name}
              x={rent.store.market.x}
              y={rent.store.market.y}
              container={rent.store.name}
            />
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
            <CustomSelect label='Wares' data={viewThings(rent.wares)} />
          </td>
          <td>
            <CustomActions data={rent} actions={[viewRentAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
