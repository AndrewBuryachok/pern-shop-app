import { ITableWithActions } from '../../common/interfaces';
import { Market } from './market.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewMarketAction } from './ViewMarketModal';

type Props = ITableWithActions<Market>;

export default function MarketsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'market', 'price', 'created', 'stores', 'action']}
      {...props}
    >
      {props.data?.result.map((market) => (
        <tr key={market.id}>
          <td>
            <AvatarWithDoubleText {...market.card} />
          </td>
          <td>
            <PlaceText {...market} withoutPrice />
          </td>
          <td>
            <PriceText {...market} />
          </td>
          <td>
            <DateText date={market.createdAt} />
          </td>
          <td>
            <TotalText data={market.stores} />
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
