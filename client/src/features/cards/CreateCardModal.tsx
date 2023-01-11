import { NativeSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateCardMutation } from './cards.api';
import { CreateCardDto } from './card.dto';
import CustomForm from '../../common/components/CustomForm';
import { selectColors } from '../../common/utils';
import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from '../../common/constants';

export default function CreateCardModal() {
  const form = useForm({
    initialValues: {
      name: '',
      color: '',
    },
    transformValues: ({ color, ...rest }) => ({ ...rest, color: +color }),
  });

  const [createCard, { isLoading }] = useCreateCardMutation();

  const handleSubmit = async (dto: CreateCardDto) => {
    await createCard(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create card'}
    >
      <TextInput
        label='Name'
        placeholder='Name'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('name')}
      />
      <NativeSelect
        label='Color'
        data={selectColors()}
        required
        {...form.getInputProps('color')}
      />
    </CustomForm>
  );
}

export const createCardButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Card',
      children: <CreateCardModal />,
    }),
};
