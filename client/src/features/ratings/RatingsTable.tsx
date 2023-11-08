import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Rating } from './rating.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import CustomRating from '../../common/components/CustomRating';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewRatingAction } from './ViewRatingModal';

type Props = ITableWithActions<Rating>;

export default function RatingsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={800}
      columns={[
        t('columns.sender'),
        t('columns.receiver'),
        t('columns.rate'),
        t('columns.created'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((rating) => (
        <tr key={rating.id}>
          <td>
            <AvatarWithSingleText {...rating.senderUser} />
          </td>
          <td>
            <AvatarWithSingleText {...rating.receiverUser} />
          </td>
          <td>
            <CustomRating value={rating.rate} />
          </td>
          <td>
            <DateText date={rating.createdAt} />
          </td>
          <td>
            <CustomActions
              data={rating}
              actions={[viewRatingAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
