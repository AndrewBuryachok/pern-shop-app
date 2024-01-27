import { ITableWithActions } from '../../common/interfaces';
import { City } from './city.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewCityAction } from './ViewCityModal';
import { openViewCityUsersAction } from './ViewCityUsersModal';

type Props = ITableWithActions<City>;

export default function CitiesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'city', 'users', 'created', 'action']}
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
            <CustomAnchor
              text={`${city.users}`}
              open={() => openViewCityUsersAction(city)}
            />
          </td>
          <td>
            <DateText date={city.createdAt} />
          </td>
          <td>
            <CustomActions data={city} actions={[viewCityAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
