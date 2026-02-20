import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Good } from './good.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewGoodAction } from './ViewGoodModal';
import { openViewGoodPurchasesModal } from './ViewGoodPurchasesModal';
import { parseThingAmount, parseThingKit } from '../../common/utils';

type Props = ITableWithActions<Good>;

export default function GoodsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'seller',
        'item',
        'stock',
        'price',
        'shop',
        'purchases',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((good) => (
        <tr key={good.id}>
          <td>
            <AvatarWithDoubleText {...good.card} />
          </td>
          <td>
            <ThingImageWithText {...good} />
          </td>
          <td>
            <SingleText text={parseThingAmount(good)} />
          </td>
          <td>
            <SingleText
              text={`${good.price} ${t('constants.currency')} / ${
                good.intake
              } ${parseThingKit(good.kit)}`}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar {...good.shop} />
          </td>
          <td>
            <CustomAnchor
              text={`${good.purchases}`}
              open={() => openViewGoodPurchasesModal(good)}
            />
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
