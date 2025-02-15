import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from './town.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditTownMutation } from './towns.api';
import { EditTownDto } from './town.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = IModal<Town>;

export default function EditTownModal({ data: town }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      townId: town.id,
      name: town.name,
      description: town.description,
      x: town.x,
      y: town.y,
    },
  });

  const [editTown, { isLoading }] = useEditTownMutation();

  const handleSubmit = async (dto: EditTownDto) => {
    await editTown(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.towns')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.name')}
        placeholder={t('columns.name')}
        required
        minLength={MIN_NAME_LENGTH}
        maxLength={MAX_NAME_LENGTH}
        {...form.getInputProps('name')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.x')}
        placeholder={t('columns.x')}
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('x')}
      />
      <NumberInput
        label={t('columns.y')}
        placeholder={t('columns.y')}
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('y')}
      />
    </CustomForm>
  );
}

export const editTownFactory = (hasRole: boolean) => ({
  open: (town: Town) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.towns'),
      children: <EditTownModal data={town} />,
    }),
  disable: (town: Town) => {
    const user = getCurrentUser()!;
    return town.user.id !== user.id && !hasRole;
  },
  color: Color.YELLOW,
});

export const editMyTownAction = editTownFactory(false);

export const editUserTownAction = editTownFactory(true);
