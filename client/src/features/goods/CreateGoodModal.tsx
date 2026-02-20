import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateGoodMutation } from './goods.api';
import {
  useSelectAllShopsQuery,
  useSelectMyShopsQuery,
} from '../shops/shops.api';
import { CreateGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingsItem';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectItems, selectKits, selectShops } from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateGoodModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      shop: '',
      item: '',
      description: '',
      amount: 1,
      intake: 1,
      kit: '',
      price: 1,
    },
    transformValues: ({ shop, kit, ...rest }) => ({
      ...rest,
      shopId: +shop,
      kit: +kit,
    }),
  });

  const { data: shops, ...shopsResponse } = hasRole
    ? useSelectAllShopsQuery()
    : useSelectMyShopsQuery();

  const [createGood, { isLoading }] = useCreateGoodMutation();

  const handleSubmit = async (dto: CreateGoodDto) => {
    const data = await createGood(dto);
    if (!('error' in data) && !hasRole) {
      navigate('/goods/my');
    }
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.goods')}
    >
      <Select
        label={t('columns.shop')}
        placeholder={t('columns.shop')}
        rightSection={<RefetchAction {...shopsResponse} />}
        itemComponent={PlacesItem}
        data={selectShops(shops)}
        limit={20}
        searchable
        required
        readOnly={shopsResponse.isFetching}
        {...form.getInputProps('shop')}
      />
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems()}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        description={
          form.values.description &&
          form.values.description.length + '/' + MAX_DESCRIPTION_LENGTH
        }
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.stock')}
        placeholder={t('columns.stock')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label={t('columns.intake')}
        placeholder={t('columns.intake')}
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label={t('columns.kit')}
        placeholder={t('columns.kit')}
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createGoodFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.goods'),
      children: <CreateGoodModal hasRole={hasRole} />,
    }),
});

export const createMyGoodButton = createGoodFactory(false);

export const createUserGoodButton = createGoodFactory(true);
