import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPlaintAction } from './ViewPlaintModal';

type Props = ITableWithActions<Plaint>;

export default function PlaintsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        t('columns.sender'),
        t('columns.receiver'),
        t('columns.title'),
        t('columns.executor'),
        t('columns.completed'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((plaint) => (
        <tr key={plaint.id}>
          <td>
            <AvatarWithSingleText {...plaint.senderUser} />
          </td>
          <td>
            <AvatarWithSingleText {...plaint.receiverUser} />
          </td>
          <td>
            <SingleText text={plaint.title} />
          </td>
          <td>
            {plaint.executorUser ? (
              <AvatarWithSingleText {...plaint.executorUser} />
            ) : (
              <SingleText text='-' />
            )}
          </td>
          <td>
            <DateText date={plaint.completedAt} />
          </td>
          <td>
            <CustomActions
              data={plaint}
              actions={[viewPlaintAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
