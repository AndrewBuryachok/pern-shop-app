import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import { useEditMarketMutation } from './markets.api';
import { EditMarketDto } from './market.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Market>;

export default function EditMarketModal({ data: market }: Props) {
  const form = useForm({
    initialValues: {
      marketId: market.id,
      name: market.name,
      x: market.x,
      y: market.y,
    },
  });

  const [editMarket, { isLoading }] = useEditMarketMutation();

  const handleSubmit = async (dto: EditMarketDto) => {
    await editMarket(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit market'}
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

export const editMarketAction = {
  open: (market: Market) =>
    openModal({
      title: 'Edit Market',
      children: <EditMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
