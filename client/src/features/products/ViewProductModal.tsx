import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Rating,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import {
  useSelectProductRatingQuery,
  useSelectProductStatesQuery,
} from './products.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseCell,
  parseItem,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Product>;

export default function ViewProductModal({ data: product }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectProductStatesQuery(
    product.id,
  );
  const { data: rating } = useSelectProductRatingQuery(product.id);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={product.id} readOnly />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...product} />}
        iconWidth={48}
        value={parseItem(product.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={product.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(product)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${product.price} ${t('constants.currency')}`}
        readOnly
      />
      <Select
        label={t('columns.prices')}
        placeholder={`${t('components.total')}: ${states?.length || 0}`}
        rightSection={<RefetchAction {...statesResponse} />}
        itemComponent={StatesItem}
        data={viewStates(states || [])}
        limit={20}
        searchable
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(product.lease.cell)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...product.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.cell.storage.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(product.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(product.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={rating?.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewProductAction = {
  open: (product: Product) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.products'),
      children: <ViewProductModal data={product} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
