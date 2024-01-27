import { ITableWithActions } from '../../common/interfaces';
import { Storage } from './storage.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import PriceText from '../../common/components/PriceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStorageAction } from './ViewStorageModal';
import { openViewStorageCellsAction } from './ViewStorageCellsModal';

type Props = ITableWithActions<Storage>;

export default function StoragesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'storage', 'price', 'cells', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((storage) => (
        <tr key={storage.id}>
          <td>
            <AvatarWithDoubleText {...storage.card} />
          </td>
          <td>
            <PlaceText {...storage} withoutPrice />
          </td>
          <td>
            <PriceText {...storage} />
          </td>
          <td>
            <CustomAnchor
              text={`${storage.cells}`}
              open={() => openViewStorageCellsAction(storage)}
            />
          </td>
          <td>
            <DateText date={storage.createdAt} />
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
