import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { useEditShopMutation } from './shops.api';
import { EditShopDto } from './shop.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Shop>;

export default function EditShopModal({ data: shop }: Props) {
  const form = useForm({
    initialValues: {
      shopId: shop.id,
      name: shop.name,
      x: shop.x,
      y: shop.y,
    },
  });

  const [editShop, { isLoading }] = useEditShopMutation();

  const handleSubmit = async (dto: EditShopDto) => {
    await editShop(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit shop'}
    >
      <TextInput
        label='Name'
        placeholder='Name'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('name')}
      />
      <NumberInput
        label='X'
        placeholder='X'
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('x')}
      />
      <NumberInput
        label='Y'
        placeholder='Y'
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('y')}
      />
    </CustomForm>
  );
}

export const editShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: 'Edit Shop',
      children: <EditShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
