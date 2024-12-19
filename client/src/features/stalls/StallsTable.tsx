import { ITableWithActions } from '../../common/interfaces';
import { Stall } from './stall.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewStallAction } from './ViewStallModal';

type Props = ITableWithActions<Stall>;

export default function StallsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'market', 'stall', 'price', 'reserved', 'action']}
      {...props}
    >
      {props.data?.result.map((stall) => (
        <tr key={stall.id}>
          <td>
            <AvatarWithDoubleText {...stall.market.card} />
          </td>
          <td>
            <PlaceText {...stall.market} />
          </td>
          <td>
            <SingleText text={`#${stall.name}`} />
          </td>
          <td>
            <PriceText {...stall.marketTag} />
          </td>
          <td>
            <DateText date={stall.reservedUntil} />
          </td>
          <td>
            <CustomActions
              data={stall}
              actions={[viewStallAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
