import { ITableWithActions } from '../../common/interfaces';
import { Good } from './good.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import ItemImage from '../../common/components/ItemImage';
import SingleText from '../../common/components/SingleText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewGoodAction } from './ViewGoodModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Good>;

export default function GoodsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={[
        'Seller',
        'Item',
        'Amount',
        'Price',
        'Shop',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((good) => (
        <tr key={good.id}>
          <td>
            <AvatarWithSingleText
              id={good.shop.user.id}
              name={good.shop.user.name}
            />
          </td>
          <td>
            <ItemImage item={good.item} description={good.description} />
          </td>
          <td>
            <SingleText text={parseThingAmount(good)} />
          </td>
          <td>
            <SingleText text={`${good.price}$`} />
          </td>
          <td>
            <PlaceText name={good.shop.name} x={good.shop.x} y={good.shop.y} />
          </td>
          <td>
            <DateText date={good.createdAt} />
          </td>
          <td>
            <CustomActions data={good} actions={[viewGoodAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
