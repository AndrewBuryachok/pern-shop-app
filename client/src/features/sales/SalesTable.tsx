import { ITableWithActions } from '../../common/interfaces';
import { Sale } from './sale.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
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
            <AvatarWithDoubleText {...sale.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...sale.product.card} />
          </td>
          <td>
            <ThingImageWithText {...sale.product} />
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
            <CustomPlaceWithAvatar
              {...sale.product.cell.storage}
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
