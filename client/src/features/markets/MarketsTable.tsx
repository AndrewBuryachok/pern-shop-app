import { ITableWithActions } from '../../common/interfaces';
import { Market } from './market.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewMarketAction } from './ViewMarketModal';
import { openViewMarketTagsAction } from './ViewMarketTagsModal';
import { openViewMarketStallsAction } from './ViewMarketStallsModal';

type Props = ITableWithActions<Market>;

export default function MarketsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'market', 'tags', 'stalls', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((market) => (
        <tr key={market.id}>
          <td>
            <AvatarWithDoubleText {...market.card} />
          </td>
          <td>
            <PlaceText {...market} />
          </td>
          <td>
            <CustomAnchor
              text={`${market.tags}`}
              open={() => openViewMarketTagsAction(market)}
            />
          </td>
          <td>
            <CustomAnchor
              text={`${market.stalls}`}
              open={() => openViewMarketStallsAction(market)}
            />
          </td>
          <td>
            <DateText date={market.createdAt} />
          </td>
          <td>
            <CustomActions
              data={market}
              actions={[viewMarketAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
