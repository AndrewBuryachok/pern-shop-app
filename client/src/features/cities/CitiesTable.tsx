import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={700}
      columns={[
        t('columns.owner'),
        t('columns.city'),
        t('columns.x'),
        t('columns.y'),
        t('columns.users'),
        t('columns.action'),
      ]}
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
