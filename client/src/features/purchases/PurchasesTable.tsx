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
            {purchase.good.shop && (
              <AvatarWithDoubleText {...purchase.good.shop.card} />
            )}
            {purchase.good.rent && (
              <AvatarWithDoubleText {...purchase.good.rent.card} />
            )}
            {purchase.good.lease && (
              <AvatarWithDoubleText {...purchase.good.lease.card} />
            )}
          </td>
          <td>
            <ThingImageWithText {...purchase.good} />
          </td>
          <td>
            <SingleText text={parsePurchaseAmount(purchase)} />
          </td>
          <td>
            {purchase.good.shop && (
              <SumText
                fromId={purchase.card.user.id}
                toId={purchase.good.shop.card.user.id}
                sum={purchase.amount * purchase.good.price}
              />
            )}
            {purchase.good.rent && (
              <SumText
                fromId={purchase.card.user.id}
                toId={purchase.good.rent.card.user.id}
                sum={purchase.amount * purchase.good.price}
              />
            )}
            {purchase.good.lease && (
              <SumText
                fromId={purchase.card.user.id}
                toId={purchase.good.lease.card.user.id}
                sum={purchase.amount * purchase.good.price}
              />
            )}
          </td>
          <td>
            {purchase.good.shop && (
              <PlaceWithDoubleAvatar {...purchase.good.shop} />
            )}
            {purchase.good.rent && (
              <PlaceWithDoubleAvatar
                {...purchase.good.rent.stall.market}
                container={purchase.good.rent.stall.name}
              />
            )}
            {purchase.good.lease && (
              <PlaceWithDoubleAvatar
                {...purchase.good.lease.cell.storage}
                container={purchase.good.lease.cell.name}
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
