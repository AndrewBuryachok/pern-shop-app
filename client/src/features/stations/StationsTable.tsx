import { ITableWithActions } from '../../common/interfaces';
import { Station } from './station.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStationAction } from './ViewStationModal';

type Props = ITableWithActions<Station>;

export default function StationsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'station', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((station) => (
        <tr key={station.id}>
          <td>
            <AvatarWithSingleText {...station.user} />
          </td>
          <td>
            <PlaceText {...station} />
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
