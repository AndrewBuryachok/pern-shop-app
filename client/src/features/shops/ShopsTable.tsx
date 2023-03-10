import { ITableWithActions } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewShopAction } from './ViewShopModal';

type Props = ITableWithActions<Shop>;

export default function ShopsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={600}
      columns={['Owner', 'Shop', 'X', 'Y', 'Goods', 'Action']}
      {...props}
    >
      {props.data?.result.map((shop) => (
        <tr key={shop.id}>
          <td>
            <AvatarWithSingleText id={shop.user.id} name={shop.user.name} />
          </td>
          <td>
            <PlaceText name={shop.name} x={shop.x} y={shop.y} />
          </td>
          <td>
            <SingleText text={`${shop.x}`} />
          </td>
          <td>
            <SingleText text={`${shop.y}`} />
          </td>
          <td>
            <TotalText data={shop.goods.length} />
          </td>
          <td>
            <CustomActions data={shop} actions={[viewShopAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
