import { ITableWithActions } from '../../common/interfaces';
import { Bargain } from './bargain.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewBargainAction } from './ViewBargainModal';
import { parseBargainAmount } from '../../common/utils';

type Props = ITableWithActions<Bargain>;

export default function BargainsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1100}
      columns={[
        'buyer',
        'seller',
        'item',
        'amount',
        'sum',
        'shop',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((bargain) => (
        <tr key={bargain.id}>
          <td>
            <AvatarWithDoubleText {...bargain.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...bargain.good.shop.card} />
          </td>
          <td>
            <ThingImageWithText {...bargain.good} />
          </td>
          <td>
            <SingleText text={parseBargainAmount(bargain)} />
          </td>
          <td>
            <SumText
              fromId={bargain.card.user.id}
              toId={bargain.good.shop.card.user.id}
              sum={bargain.amount * bargain.good.price}
            />
          </td>
          <td>
            <PlaceText {...bargain.good.shop} />
          </td>
          <td>
            <DateText date={bargain.createdAt} />
          </td>
          <td>
            <CustomActions
              data={bargain}
              actions={[viewBargainAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
