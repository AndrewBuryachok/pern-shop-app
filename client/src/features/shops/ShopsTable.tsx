import { ITableWithActions } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewShopAction } from './ViewShopModal';
import { openViewShopUsersAction } from './ViewShopUsersModal';
import { openViewShopGoodsAction } from './ViewShopGoodsModal';

type Props = ITableWithActions<Shop>;

export default function ShopsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'shop', 'users', 'goods', 'created', 'action']}
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
            <CustomAnchor
              text={`${shop.users}`}
              open={() => openViewShopUsersAction(shop)}
            />
          </td>
          <td>
            <CustomAnchor
              text={`${shop.goods}`}
              open={() => openViewShopGoodsAction(shop)}
            />
          </td>
          <td>
            <DateText date={shop.createdAt} />
          </td>
          <td>
            <CustomActions data={shop} actions={[viewShopAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
