import { ITableWithActions } from '../../common/interfaces';
import { Cell } from './cell.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewCellAction } from './ViewCellModal';

type Props = ITableWithActions<Cell>;

export default function CellsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={600}
      columns={['Owner', 'Storage', 'Cell', 'Price', 'Reserved', 'Action']}
      {...props}
    >
      {props.data?.result.map((cell) => (
        <tr key={cell.id}>
          <td>
            <AvatarWithDoubleText
              id={cell.storage.card.user.id}
              name={cell.storage.card.user.name}
              text={cell.storage.card.name}
              color={cell.storage.card.color}
            />
          </td>
          <td>
            <PlaceText
              name={cell.storage.name}
              x={cell.storage.x}
              y={cell.storage.y}
            />
          </td>
          <td>
            <SingleText text={`#${cell.name}`} />
          </td>
          <td>
            <SingleText text={`${cell.storage.price}$`} />
          </td>
          <td>
            {cell.reservedAt ? (
              <DateText date={cell.reservedAt} />
            ) : (
              <SingleText text={'-'} />
            )}
          </td>
          <td>
            <CustomActions data={cell} actions={[viewCellAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
