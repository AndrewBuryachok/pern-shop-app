import { Loader, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateMarketMutation } from './markets.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { CreateMarketDto } from './market.dto';
import CustomForm from '../../common/components/CustomForm';
import { CardsItem } from '../../common/components/CardsItem';
import { selectCardsWithBalance } from '../../common/utils';
import {
  MAX_COORDINATE_VALUE,
  MAX_TEXT_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

export default function CreateMarketModal() {
  const form = useForm({
    initialValues: {
      card: '',
      name: '',
      x: 0,
      y: 0,
      price: 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: cards, isFetching: isCardsFetching } = useSelectMyCardsQuery();

  const [createMarket, { isLoading }] = useCreateMarketMutation();

  const handleSubmit = async (dto: CreateMarketDto) => {
    await createMarket(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create market'}
    >
      <Select
        label='Card'
        placeholder='Card'
        rightSection={isCardsFetching && <Loader size={16} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={isCardsFetching}
        {...form.getInputProps('card')}
      />
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
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const createMarketButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Market',
      children: <CreateMarketModal />,
    }),
};
