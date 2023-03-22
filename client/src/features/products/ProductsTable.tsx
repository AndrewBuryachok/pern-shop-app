import { ITableWithActions } from '../../common/interfaces';
import { Product } from './product.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewProductAction } from './ViewProductModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Product>;

export default function ProductsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'Seller',
        'Item',
        'Amount',
        'Price',
        'Storage',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((product) => (
        <tr key={product.id}>
          <td>
            <AvatarWithDoubleText {...product.card} />
          </td>
          <td>
            <ThingImageWithText {...product} />
          </td>
          <td>
            <SingleText text={parseThingAmount(product)} />
          </td>
          <td>
            <PriceText {...product} />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...product.cell.storage}
              container={product.cell.name}
            />
          </td>
          <td>
            <DateText date={product.createdAt} />
          </td>
          <td>
            <CustomActions
              data={product}
              actions={[viewProductAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
