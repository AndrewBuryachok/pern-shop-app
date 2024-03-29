import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewShopAction } from './ViewShopModal';

type Props = ITableWithActions<Shop>;

export default function ShopsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={700}
      columns={[
        t('columns.owner'),
        t('columns.shop'),
        t('columns.x'),
        t('columns.y'),
        t('columns.goods'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((shop) => (
        <tr key={shop.id}>
          <td>
            <AvatarWithSingleText {...shop.user} />
          </td>
          <td>
            <PlaceText {...shop} />
          </td>
          <td>
            <SingleText text={`${shop.x}`} />
          </td>
          <td>
            <SingleText text={`${shop.y}`} />
          </td>
          <td>
            <TotalText data={shop.goods.length} />
          </td>
          <td>
            <CustomActions data={shop} actions={[viewShopAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
