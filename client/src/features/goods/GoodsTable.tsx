import { ITableWithActions } from '../../common/interfaces';
import { Good } from './good.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewGoodAction } from './ViewGoodModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Good>;

export default function GoodsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'seller',
        'item',
        'amount',
        'price',
        'place',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((good) => (
        <tr key={good.id}>
          <td>
            <AvatarWithDoubleText {...good.card} />
          </td>
          <td>
            <ThingImageWithText {...good} />
          </td>
          <td>
            <SingleText text={parseThingAmount(good)} />
          </td>
          <td>
            <PriceText {...good} />
          </td>
          <td>
            {good.shop && <PlaceWithDoubleAvatar {...good.shop} />}
            {good.rent && (
              <PlaceWithDoubleAvatar
                {...good.rent.stall.market}
                container={good.rent.stall.name}
              />
            )}
            {good.lease && (
              <PlaceWithDoubleAvatar
                {...good.lease.cell.storage}
                container={good.lease.cell.name}
              />
            )}
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
