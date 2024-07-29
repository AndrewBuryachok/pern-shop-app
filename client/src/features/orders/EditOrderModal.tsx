import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useEditOrderMutation } from './orders.api';
import { EditOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingsItem';
import { selectCategories, selectItems, selectKits } from '../../common/utils';
import {
  Color,
  items,
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
  Status,
} from '../../common/constants';

type Props = IModal<Order>;

export default function EditOrderModal({ data: order }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      orderId: order.id,
      category: items[order.item - 1][0],
      item: `${order.item}`,
      description: order.description,
      amount: order.amount,
      intake: order.intake,
      kit: `${order.kit}`,
      price: order.price,
    },
    transformValues: ({ item, kit, ...rest }) => ({
      ...rest,
      item: +item,
      kit: +kit,
    }),
  });

  useEffect(() => form.setFieldValue('item', ''), [form.values.category]);

  useEffect(() => form.setFieldValue('item', `${order.item}`), []);

  const [editOrder, { isLoading }] = useEditOrderMutation();

  const handleSubmit = async (dto: EditOrderDto) => {
    await editOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.orders')}
      isChanged={!form.isDirty()}
    >
      <Select
        label={t('columns.category')}
        placeholder={t('columns.category')}
        data={selectCategories()}
        searchable
        allowDeselect
        {...form.getInputProps('category')}
      />
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={+form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems(form.values.category)}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
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

export const editOrderAction = {
  open: (order: Order) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.orders'),
      children: <EditOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.CREATED,
  color: Color.YELLOW,
};
