import { ITableWithActions } from '../../common/interfaces';
import { Hire } from './hire.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewHireAction } from './ViewHireModal';
import { openViewHireThingsAction } from './ViewHireThingsModal';

type Props = ITableWithActions<Hire>;

export default function HiresTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={900}
      columns={[
        'renter',
        'owner',
        'station',
        'sum',
        'things',
        'completed',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((hire) => (
        <tr key={hire.id}>
          <td>
            <AvatarWithDoubleText {...hire.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...hire.drawer.station.card} />
          </td>
          <td>
            <PlaceText {...hire.drawer.station} container={hire.drawer.name} />
          </td>
          <td>
            <SumText
              fromId={hire.card.user.id}
              toId={hire.drawer.station.card.user.id}
              sum={hire.drawer.station.price}
            />
          </td>
          <td>
            <CustomAnchor
              text='1'
              open={() => openViewHireThingsAction(hire)}
            />
          </td>
          <td>
            <DateText date={hire.completedAt} />
          </td>
          <td>
            <CustomActions data={hire} actions={[viewHireAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
