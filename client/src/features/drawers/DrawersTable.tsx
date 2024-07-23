import { ITableWithActions } from '../../common/interfaces';
import { Drawer } from './drawer.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewDrawerAction } from './ViewDrawerModal';

type Props = ITableWithActions<Drawer>;

export default function DrawersTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'station', 'drawer', 'price', 'reserved', 'action']}
      {...props}
    >
      {props.data?.result.map((drawer) => (
        <tr key={drawer.id}>
          <td>
            <AvatarWithDoubleText {...drawer.station.card} />
          </td>
          <td>
            <PlaceText {...drawer.station} />
          </td>
          <td>
            <SingleText text={`#${drawer.name}`} />
          </td>
          <td>
            <PriceText {...drawer.station} />
          </td>
          <td>
            <DateText date={drawer.reservedUntil} />
          </td>
          <td>
            <CustomActions
              data={drawer}
              actions={[viewDrawerAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
