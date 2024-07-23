import { ITableWithActions } from '../../common/interfaces';
import { Station } from './station.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import PriceText from '../../common/components/PriceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStationAction } from './ViewStationModal';
import { openViewStationDrawersAction } from './ViewStationDrawersModal';

type Props = ITableWithActions<Station>;

export default function StationsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'station', 'price', 'drawers', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((station) => (
        <tr key={station.id}>
          <td>
            <AvatarWithDoubleText {...station.card} />
          </td>
          <td>
            <PlaceText {...station} />
          </td>
          <td>
            <PriceText {...station} />
          </td>
          <td>
            <CustomAnchor
              text={`${station.drawers}`}
              open={() => openViewStationDrawersAction(station)}
            />
          </td>
          <td>
            <DateText date={station.createdAt} />
          </td>
          <td>
            <CustomActions
              data={station}
              actions={[viewStationAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
