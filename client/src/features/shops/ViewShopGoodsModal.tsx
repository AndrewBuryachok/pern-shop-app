import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { useSelectShopGoodsQuery } from './shops.api';
import RefetchAction from '../../common/components/RefetchAction';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import { viewThings } from '../../common/utils';

type Props = IModal<Shop>;

export default function ViewShopGoodsModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const { data: goods, ...goodsResponse } = useSelectShopGoodsQuery(shop.id);

  return (
    <Select
      label={t('columns.goods')}
      placeholder={`${t('components.total')}: ${goods?.length || 0}`}
      rightSection={<RefetchAction {...goodsResponse} />}
      itemComponent={ThingsItemWithAmount}
      data={viewThings(goods || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewShopGoodsAction = (shop: Shop) =>
  openModal({
    title: t('columns.goods'),
    children: <ViewShopGoodsModal data={shop} />,
  });
