import { ITableWithActions } from '../../common/interfaces';
import { Purchase } from './purchase.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPurchaseAction } from './ViewPurchaseModal';
import { parsePurchaseAmount } from '../../common/utils';

type Props = ITableWithActions<Purchase>;

export default function PurchasesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1100}
      columns={[
        'buyer',
        'seller',
        'item',
        'amount',
        'sum',
        'place',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((purchase) => (
        <tr key={purchase.id}>
          <td>
            <AvatarWithDoubleText {...purchase.card} />
          </td>
          <td>
            {purchase.good && (
              <AvatarWithDoubleText {...purchase.good.shop.card} />
            )}
            {purchase.ware && (
              <AvatarWithDoubleText {...purchase.ware.rent.card} />
            )}
            {purchase.product && (
              <AvatarWithDoubleText {...purchase.product.lease.card} />
            )}
          </td>
          <td>
            {purchase.good && <ThingImageWithText {...purchase.good} />}
            {purchase.ware && <ThingImageWithText {...purchase.ware} />}
            {purchase.product && <ThingImageWithText {...purchase.product} />}
          </td>
          <td>
            <SingleText text={parsePurchaseAmount(purchase)} />
          </td>
          <td>
            {purchase.good && (
              <SumText
                fromId={purchase.card.user.id}
                toId={purchase.good.shop.card.user.id}
                sum={purchase.amount * purchase.good.price}
              />
            )}
            {purchase.ware && (
              <SumText
                fromId={purchase.card.user.id}
                toId={purchase.ware.rent.card.user.id}
                sum={purchase.amount * purchase.ware.price}
              />
            )}
            {purchase.product && (
              <SumText
                fromId={purchase.card.user.id}
                toId={purchase.product.lease.card.user.id}
                sum={purchase.amount * purchase.product.price}
              />
            )}
          </td>
          <td>
            {purchase.good && <PlaceWithDoubleAvatar {...purchase.good.shop} />}
            {purchase.ware && (
              <PlaceWithDoubleAvatar
                {...purchase.ware.rent.stall.market}
                container={purchase.ware.rent.stall.name}
              />
            )}
            {purchase.product && (
              <PlaceWithDoubleAvatar
                {...purchase.product.lease.cell.storage}
                container={purchase.product.lease.cell.name}
              />
            )}
          </td>
          <td>
            <DateText date={purchase.createdAt} />
          </td>
          <td>
            <CustomActions
              data={purchase}
              actions={[viewPurchaseAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
