import { ITableWithActions } from '../../common/interfaces';
import { Ware } from './ware.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImage from '../../common/components/ThingImage';
import SingleText from '../../common/components/SingleText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewWareAction } from './ViewWareModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Ware>;

export default function WaresTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'Seller',
        'Item',
        'Amount',
        'Price',
        'Market',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((ware) => (
        <tr key={ware.id}>
          <td>
            <AvatarWithDoubleText
              id={ware.rent.card.user.id}
              name={ware.rent.card.user.name}
              text={ware.rent.card.name}
              color={ware.rent.card.color}
            />
          </td>
          <td>
            <ThingImage item={ware.item} description={ware.description} />
          </td>
          <td>
            <SingleText text={parseThingAmount(ware)} />
          </td>
          <td>
            <SingleText text={`${ware.price}$`} />
          </td>
          <td>
            <PlaceText
              name={ware.rent.store.market.name}
              x={ware.rent.store.market.x}
              y={ware.rent.store.market.y}
              container={ware.rent.store.name}
            />
          </td>
          <td>
            <DateText date={ware.createdAt} />
          </td>
          <td>
            <CustomActions data={ware} actions={[viewWareAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
