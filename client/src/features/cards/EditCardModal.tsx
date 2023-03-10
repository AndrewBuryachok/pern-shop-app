import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import { useEditCardMutation } from './cards.api';
import { EditCardDto } from './card.dto';
import CustomForm from '../../common/components/CustomForm';
import { selectColors } from '../../common/utils';
import {
  Color,
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Card>;

export default function EditCardModal({ data: card }: Props) {
  const form = useForm({
    initialValues: {
      cardId: card.id,
      name: card.name,
      color: `${card.color}`,
    },
    transformValues: ({ color, ...rest }) => ({ ...rest, color: +color }),
  });

  const [editCard, { isLoading }] = useEditCardMutation();

  const handleSubmit = async (dto: EditCardDto) => {
    await editCard(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit card'}
    >
      <TextInput
        label='Name'
        placeholder='Name'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('name')}
      />
      <Select
        label='Color'
        placeholder='Color'
        data={selectColors()}
        searchable
        required
        {...form.getInputProps('color')}
      />
    </CustomForm>
  );
}

export const editCardAction = {
  open: (card: Card) =>
    openModal({
      title: 'Edit Card',
      children: <EditCardModal data={card} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
