import { ITableWithActions } from '../../common/interfaces';
import { City } from './city.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewCityAction } from './ViewCityModal';

type Props = ITableWithActions<City>;

export default function CitiesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'city', 'created', 'users', 'action']}
      {...props}
    >
      {props.data?.result.map((city) => (
        <tr key={city.id}>
          <td>
            <AvatarWithSingleText {...city.user} />
          </td>
          <td>
            <PlaceText {...city} />
          </td>
          <td>
            <DateText date={city.createdAt} />
          </td>
          <td>
            <TotalText data={city.users} />
          </td>
          <td>
            <CustomActions data={city} actions={[viewCityAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
