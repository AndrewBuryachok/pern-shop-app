import { ITableWithActions } from '../../common/interfaces';
import { Box } from './box.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewBoxAction } from './ViewBoxModal';

type Props = ITableWithActions<Box>;

export default function BoxesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'station', 'box', 'price', 'reserved', 'action']}
      {...props}
    >
      {props.data?.result.map((box) => (
        <tr key={box.id}>
          <td>
            <AvatarWithDoubleText {...box.station.card} />
          </td>
          <td>
            <PlaceText {...box.station} />
          </td>
          <td>
            <SingleText text={`#${box.name}`} />
          </td>
          <td>
            <PriceText {...box.station} />
          </td>
          <td>
            <DateText date={box.reservedUntil} />
          </td>
          <td>
            <CustomActions data={box} actions={[viewBoxAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
