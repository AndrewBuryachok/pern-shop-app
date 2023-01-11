import { ITableWithActions } from '../../common/interfaces';
import { Storage } from './storage.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import CustomSelect from '../../common/components/CustomSelect';
import CustomActions from '../../common/components/CustomActions';
import { viewStorageAction } from './ViewStorageModal';
import { viewContainers } from '../../common/utils';

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
            <AvatarWithDoubleText
              id={storage.card.user.id}
              name={storage.card.user.name}
              text={storage.card.name}
              color={storage.card.color}
            />
          </td>
          <td>
            <PlaceText name={storage.name} x={storage.x} y={storage.y} />
          </td>
          <td>
            <SingleText text={`${storage.x}`} />
          </td>
          <td>
            <SingleText text={`${storage.y}`} />
          </td>
          <td>
            <SingleText text={`${storage.price}$`} />
          </td>
          <td>
            <CustomSelect label='Cells' data={viewContainers(storage.cells)} />
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
