import { ITableWithActions } from '../../common/interfaces';
import { Product } from './product.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImage from '../../common/components/ThingImage';
import SingleText from '../../common/components/SingleText';
import PlaceText from '../../common/components/PlaceText';
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
            <AvatarWithDoubleText
              id={product.card.user.id}
              name={product.card.user.name}
              text={product.card.name}
              color={product.card.color}
            />
          </td>
          <td>
            <ThingImage item={product.item} description={product.description} />
          </td>
          <td>
            <SingleText text={parseThingAmount(product)} />
          </td>
          <td>
            <SingleText text={`${product.price}$`} />
          </td>
          <td>
            <PlaceText
              name={product.cell.storage.name}
              x={product.cell.storage.x}
              y={product.cell.storage.y}
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
