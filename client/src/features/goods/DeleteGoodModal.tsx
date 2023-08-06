import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useDeleteGoodMutation } from './goods.api';
import { DeleteGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parsePlace, parseThingAmount, parseTime } from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Good>;

export default function DeleteGoodModal({ data: good }: Props) {
  const form = useForm({
    initialValues: {
      goodId: good.id,
    },
  });

  const [deleteGood, { isLoading }] = useDeleteGoodMutation();

  const handleSubmit = async (dto: DeleteGoodDto) => {
    await deleteGood(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Delete good'}
    >
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...good.shop.user} />}
        iconWidth={48}
        value={good.shop.user.name}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...good} />}
        iconWidth={48}
        value={items[good.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={good.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(good)} disabled />
      <TextInput label='Price' value={`${good.price}$`} disabled />
      <TextInput label='Shop' value={parsePlace(good.shop)} disabled />
      <TextInput label='Created' value={parseTime(good.createdAt)} disabled />
    </CustomForm>
  );
}

export const deleteGoodAction = {
  open: (good: Good) =>
    openModal({
      title: 'Delete Good',
      children: <DeleteGoodModal data={good} />,
    }),
  disable: () => false,
  color: Color.RED,
};
