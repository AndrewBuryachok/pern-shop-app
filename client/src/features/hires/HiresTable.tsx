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
        'tenant',
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
            <AvatarWithDoubleText {...hire.box.station.card} />
          </td>
          <td>
            <PlaceText {...hire.box.station} container={hire.box.name} />
          </td>
          <td>
            <SumText
              fromId={hire.card.user.id}
              toId={hire.box.station.card.user.id}
              sum={hire.sum}
            />
          </td>
          <td>
            <CustomAnchor
              text={`${
                hire.orders +
                hire.fromHaulages +
                hire.toHaulages +
                hire.shopsDeliveries +
                hire.marketsDeliveries +
                hire.storagesDeliveries
              }`}
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
