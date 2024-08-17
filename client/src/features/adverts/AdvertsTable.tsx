import { ITableWithActions } from '../../common/interfaces';
import { Advert } from './advert.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewAdvertAction } from './ViewAdvertModal';

type Props = ITableWithActions<Advert>;

export default function AdvertsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['executor', 'activity', 'price', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((advert) => (
        <tr key={advert.id}>
          <td>
            <AvatarWithDoubleText {...advert.card} />
          </td>
          <td>
            <SingleText text={advert.activity} />
          </td>
          <td>
            <PriceText {...advert} />
          </td>
          <td>
            <DateText date={advert.createdAt} />
          </td>
          <td>
            <CustomActions
              data={advert}
              actions={[viewAdvertAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
