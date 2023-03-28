import { ITableWithActions } from '../../common/interfaces';
import { Cell } from './cell.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewCellAction } from './ViewCellModal';

type Props = ITableWithActions<Cell>;

export default function CellsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['Owner', 'Storage', 'Cell', 'Price', 'Reserved', 'Action']}
      {...props}
    >
      {props.data?.result.map((cell) => (
        <tr key={cell.id}>
          <td>
            <AvatarWithDoubleText {...cell.storage.card} />
          </td>
          <td>
            <PlaceText {...cell.storage} />
          </td>
          <td>
            <SingleText text={`#${cell.name}`} />
          </td>
          <td>
            <PriceText {...cell.storage} />
          </td>
          <td>
            <DateText date={cell.reservedAt} />
          </td>
          <td>
            <CustomActions data={cell} actions={[viewCellAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
