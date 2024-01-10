import { ITableWithActions } from '../../common/interfaces';
import { Store } from './store.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStoreAction } from './ViewStoreModal';

type Props = ITableWithActions<Store>;

export default function StoresTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'market', 'store', 'price', 'reserved', 'action']}
      {...props}
    >
      {props.data?.result.map((store) => (
        <tr key={store.id}>
          <td>
            <AvatarWithDoubleText {...store.market.card} />
          </td>
          <td>
            <PlaceText {...store.market} withoutPrice />
          </td>
          <td>
            <SingleText text={`#${store.name}`} />
          </td>
          <td>
            <PriceText {...store.market} />
          </td>
          <td>
            <DateText date={store.reservedAt} />
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
