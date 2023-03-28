import { ITableWithActions } from '../../common/interfaces';
import { City } from './city.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewCityAction } from './ViewCityModal';

type Props = ITableWithActions<City>;

export default function CitiesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['Owner', 'City', 'X', 'Y', 'Users', 'Action']}
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
            <SingleText text={`${city.x}`} />
          </td>
          <td>
            <SingleText text={`${city.y}`} />
          </td>
          <td>
            <TotalText data={city.users.length} />
          </td>
          <td>
            <CustomActions data={city} actions={[viewCityAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
