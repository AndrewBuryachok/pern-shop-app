import { ITableWithActions } from '../../common/interfaces';
import { Sale } from './sale.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewSaleAction } from './ViewSaleModal';
import { parseSaleAmount } from '../../common/utils';

type Props = ITableWithActions<Sale>;

export default function SalesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1100}
      columns={[
        'buyer',
        'seller',
        'item',
        'amount',
        'sum',
        'storage',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((sale) => (
        <tr key={sale.id}>
          <td>
            <AvatarWithDoubleText {...sale.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...sale.product.lease.card} />
          </td>
          <td>
            <ThingImageWithText {...sale.product} />
          </td>
          <td>
            <SingleText text={parseSaleAmount(sale)} />
          </td>
          <td>
            <SumText
              fromId={sale.card.user.id}
              toId={sale.product.lease.card.user.id}
              sum={sale.amount * sale.product.price}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...sale.product.lease.cell.storage}
              container={sale.product.lease.cell.name}
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
