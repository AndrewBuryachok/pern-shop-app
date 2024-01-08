import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Market } from './market.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewMarketAction } from './ViewMarketModal';

type Props = ITableWithActions<Market>;

export default function MarketsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={700}
      columns={[
        t('columns.owner'),
        t('columns.market'),
        t('columns.x'),
        t('columns.y'),
        t('columns.price'),
        t('columns.stores'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((market) => (
        <tr key={market.id}>
          <td>
            <AvatarWithDoubleText {...market.card} />
          </td>
          <td>
            <PlaceText {...market} withoutPrice />
          </td>
          <td>
            <SingleText text={`${market.x}`} />
          </td>
          <td>
            <SingleText text={`${market.y}`} />
          </td>
          <td>
            <PriceText {...market} />
          </td>
          <td>
            <TotalText data={market.stores} />
          </td>
          <td>
            <CustomActions
              data={market}
              actions={[viewMarketAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
