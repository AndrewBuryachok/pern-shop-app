import { ITableWithActions } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewShopAction } from './ViewShopModal';

type Props = ITableWithActions<Shop>;

export default function ShopsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'shop', 'created', 'users', 'goods', 'action']}
      {...props}
    >
      {props.data?.result.map((shop) => (
        <tr key={shop.id}>
          <td>
            <AvatarWithSingleText {...shop.user} />
          </td>
          <td>
            <PlaceText {...shop} />
          </td>
          <td>
            <DateText date={shop.createdAt} />
          </td>
          <td>
            <TotalText data={shop.users} />
          </td>
          <td>
            <TotalText data={shop.goods} />
          </td>
          <td>
            <CustomActions data={shop} actions={[viewShopAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
