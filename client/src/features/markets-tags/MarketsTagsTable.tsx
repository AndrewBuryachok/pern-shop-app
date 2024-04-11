import { ITableWithActions } from '../../common/interfaces';
import { MarketTag } from './market-tag.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewMarketTagAction } from './ViewMarketTagModal';
import { openViewMarketTagStoresAction } from './ViewMarketTagStoresModal';

type Props = ITableWithActions<MarketTag>;

export default function MarketsTagsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={[
        'owner',
        'market',
        'tag',
        'price',
        'stores',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((marketTag) => (
        <tr key={marketTag.id}>
          <td>
            <AvatarWithDoubleText {...marketTag.market.card} />
          </td>
          <td>
            <PlaceText {...marketTag.market} />
          </td>
          <td>
            <SingleText text={marketTag.name} />
          </td>
          <td>
            <PriceText {...marketTag} />
          </td>
          <td>
            <CustomAnchor
              text={`${marketTag.stores}`}
              open={() => openViewMarketTagStoresAction(marketTag)}
            />
          </td>
          <td>
            <DateText date={marketTag.createdAt} />
          </td>
          <td>
            <CustomActions
              data={marketTag}
              actions={[viewMarketTagAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
