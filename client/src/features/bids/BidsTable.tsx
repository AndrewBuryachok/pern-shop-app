import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Bid } from './bid.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewBidAction } from './ViewBidModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Bid>;

export default function BidsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1100}
      columns={[
        t('columns.buyer'),
        t('columns.seller'),
        t('columns.item'),
        t('columns.amount'),
        t('columns.sum'),
        t('columns.storage'),
        t('columns.created'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((bid) => (
        <tr key={bid.id}>
          <td>
            <AvatarWithDoubleText {...bid.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...bid.lot.lease.card} />
          </td>
          <td>
            <ThingImageWithText {...bid.lot} />
          </td>
          <td>
            <SingleText text={parseThingAmount(bid.lot)} />
          </td>
          <td>
            <SumText
              fromId={bid.card.user.id}
              toId={bid.lot.lease.card.user.id}
              sum={bid.price}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...bid.lot.lease.cell.storage}
              container={bid.lot.lease.cell.name}
            />
          </td>
          <td>
            <DateText date={bid.createdAt} />
          </td>
          <td>
            <CustomActions data={bid} actions={[viewBidAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
