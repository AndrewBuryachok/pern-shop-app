import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useEditGoodMutation } from './goods.api';
import { EditGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import { ThingsItem } from '../../common/components/ThingItem';
import { selectCategories, selectItems, selectKits } from '../../common/utils';
import {
  Color,
  items,
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = IModal<Good>;

export default function EditGoodModal({ data: good }: Props) {
  const form = useForm({
    initialValues: {
      goodId: good.id,
      category: items[good.item - 1][0],
      item: `${good.item}`,
      description: good.description,
      amount: good.amount,
      intake: good.intake,
      kit: `${good.kit}`,
      price: good.price,
    },
    transformValues: ({ item, kit, ...rest }) => ({
      ...rest,
      item: +item,
      kit: +kit,
    }),
  });

  const [editGood, { isLoading }] = useEditGoodMutation();

  const handleSubmit = async (dto: EditGoodDto) => {
    await editGood(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit good'}
    >
      <Select
        label='Category'
        placeholder='Category'
        data={selectCategories()}
        searchable
        required
        {...form.getInputProps('category')}
      />
      <Select
        label='Item'
        placeholder='Item'
        itemComponent={ThingsItem}
        data={selectItems(form.values.category)}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label='Amount'
        placeholder='Amount'
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label='Intake'
        placeholder='Intake'
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label='Kit'
        placeholder='Kit'
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
      />
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editGoodAction = {
  open: (good: Good) =>
    openModal({
      title: 'Edit Good',
      children: <EditGoodModal data={good} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
