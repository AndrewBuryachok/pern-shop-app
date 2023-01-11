import { ITableWithActions } from '../../common/interfaces';
import { Store } from './store.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStoreAction } from './ViewStoreModal';

type Props = ITableWithActions<Store>;

export default function StoresTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={600}
      columns={['Owner', 'Market', 'Store', 'Price', 'Reserved', 'Action']}
      {...props}
    >
      {props.data?.result.map((store) => (
        <tr key={store.id}>
          <td>
            <AvatarWithDoubleText
              id={store.market.card.user.id}
              name={store.market.card.user.name}
              text={store.market.card.name}
              color={store.market.card.color}
            />
          </td>
          <td>
            <PlaceText
              name={store.market.name}
              x={store.market.x}
              y={store.market.y}
            />
          </td>
          <td>
            <SingleText text={`#${store.name}`} />
          </td>
          <td>
            <SingleText text={`${store.market.price}$`} />
          </td>
          <td>
            {store.reservedAt ? (
              <DateText date={store.reservedAt} />
            ) : (
              <SingleText text={'-'} />
            )}
          </td>
          <td>
            <CustomActions
              data={store}
              actions={[viewStoreAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
