import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Ware } from './ware.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewWareAction } from './ViewWareModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Ware>;

export default function WaresTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        t('columns.seller'),
        t('columns.item'),
        t('columns.amount'),
        t('columns.price'),
        t('columns.market'),
        t('columns.created'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((ware) => (
        <tr key={ware.id}>
          <td>
            <AvatarWithDoubleText {...ware.rent.card} />
          </td>
          <td>
            <ThingImageWithText {...ware} />
          </td>
          <td>
            <SingleText text={parseThingAmount(ware)} />
          </td>
          <td>
            <PriceText {...ware} />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...ware.rent.store.market}
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
