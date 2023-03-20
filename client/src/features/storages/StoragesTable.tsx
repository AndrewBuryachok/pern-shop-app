import { ITableWithActions } from '../../common/interfaces';
import { Storage } from './storage.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewStorageAction } from './ViewStorageModal';

type Props = ITableWithActions<Storage>;

export default function StoragesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={600}
      columns={['Owner', 'Storage', 'X', 'Y', 'Price', 'Cells', 'Action']}
      {...props}
    >
      {props.data?.result.map((storage) => (
        <tr key={storage.id}>
          <td>
            <AvatarWithDoubleText {...storage.card} />
          </td>
          <td>
            <PlaceText {...storage} />
          </td>
          <td>
            <SingleText text={`${storage.x}`} />
          </td>
          <td>
            <SingleText text={`${storage.y}`} />
          </td>
          <td>
            <PriceText {...storage} />
          </td>
          <td>
            <TotalText data={storage.cells.length} />
          </td>
          <td>
            <CustomActions
              data={storage}
              actions={[viewStorageAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
