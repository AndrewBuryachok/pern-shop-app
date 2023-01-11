import { ITableWithActions } from '../../common/interfaces';
import { Sale } from './sale.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ItemImage from '../../common/components/ItemImage';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewSaleAction } from './ViewSaleModal';
import { parseSaleAmount } from '../../common/utils';

type Props = ITableWithActions<Sale>;

export default function SalesTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'Buyer',
        'Seller',
        'Item',
        'Amount',
        'Sum',
        'Storage',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((sale) => (
        <tr key={sale.id}>
          <td>
            <AvatarWithDoubleText
              id={sale.card.user.id}
              name={sale.card.user.name}
              text={sale.card.name}
              color={sale.card.color}
            />
          </td>
          <td>
            <AvatarWithDoubleText
              id={sale.product.card.user.id}
              name={sale.product.card.user.name}
              text={sale.product.card.name}
              color={sale.product.card.color}
            />
          </td>
          <td>
            <ItemImage
              item={sale.product.item}
              description={sale.product.description}
            />
          </td>
          <td>
            <SingleText text={parseSaleAmount(sale)} />
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={sale.card.user.id}
              toId={sale.product.card.user.id}
              sum={sale.amount * sale.product.price}
            />
          </td>
          <td>
            <PlaceText
              name={sale.product.cell.storage.name}
              x={sale.product.cell.storage.x}
              y={sale.product.cell.storage.y}
              container={sale.product.cell.name}
            />
          </td>
          <td>
            <DateText date={sale.createdAt} />
          </td>
          <td>
            <CustomActions data={sale} actions={[viewSaleAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
