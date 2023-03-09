import { ITableWithActions } from '../../common/interfaces';
import { Market } from './market.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewMarketAction } from './ViewMarketModal';

type Props = ITableWithActions<Market>;

export default function MarketsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={600}
      columns={['Owner', 'Market', 'X', 'Y', 'Price', 'Stores', 'Action']}
      {...props}
    >
      {props.data?.result.map((market) => (
        <tr key={market.id}>
          <td>
            <AvatarWithDoubleText
              id={market.card.user.id}
              name={market.card.user.name}
              text={market.card.name}
              color={market.card.color}
            />
          </td>
          <td>
            <PlaceText name={market.name} x={market.x} y={market.y} />
          </td>
          <td>
            <SingleText text={`${market.x}`} />
          </td>
          <td>
            <SingleText text={`${market.y}`} />
          </td>
          <td>
            <SingleText text={`${market.price}$`} />
          </td>
          <td>
            <TotalText data={market.stores.length} />
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
