import { ITableWithActions } from '../../common/interfaces';
import { StorageTag } from './storage-tag.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStorageTagAction } from './ViewStorageTagModal';
import { openViewStorageTagCellsAction } from './ViewStorageTagCellsModal';

type Props = ITableWithActions<StorageTag>;

export default function StoragesTagsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={[
        'owner',
        'storage',
        'tag',
        'price',
        'cells',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((storageTag) => (
        <tr key={storageTag.id}>
          <td>
            <AvatarWithDoubleText {...storageTag.storage.card} />
          </td>
          <td>
            <PlaceText {...storageTag.storage} />
          </td>
          <td>
            <SingleText text={storageTag.name} />
          </td>
          <td>
            <PriceText {...storageTag} />
          </td>
          <td>
            <CustomAnchor
              text={`${storageTag.cells}`}
              open={() => openViewStorageTagCellsAction(storageTag)}
            />
          </td>
          <td>
            <DateText date={storageTag.createdAt} />
          </td>
          <td>
            <CustomActions
              data={storageTag}
              actions={[viewStorageTagAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
