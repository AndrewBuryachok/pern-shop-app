import { ITableWithActions } from '../../common/interfaces';
import { Good } from './good.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import PlaceText from '../../common/components/PlaceText';
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
        'Seller',
        'Item',
        'Amount',
        'Price',
        'Shop',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((good) => (
        <tr key={good.id}>
          <td>
            <AvatarWithSingleText {...good.shop.user} />
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
            <PlaceText {...good.shop} />
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
