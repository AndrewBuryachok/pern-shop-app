import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Farm } from './farm.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditFarmMutation } from './farms.api';
import { EditFarmDto } from './farm.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = IModal<Farm>;

export default function EditFarmModal({ data: farm }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      farmId: farm.id,
      name: farm.name,
      description: farm.description,
      x: farm.x,
      y: farm.y,
    },
  });

  const [editFarm, { isLoading }] = useEditFarmMutation();

  const handleSubmit = async (dto: EditFarmDto) => {
    await editFarm(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.farms')}
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

export const editFarmFactory = (hasRole: boolean) => ({
  open: (farm: Farm) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.farms'),
      children: <EditFarmModal data={farm} />,
    }),
  disable: (farm: Farm) => {
    const user = getCurrentUser()!;
    return farm.user.id !== user.id && !hasRole;
  },
  color: Color.YELLOW,
});

export const editMyFarmAction = editFarmFactory(false);

export const editUserFarmAction = editFarmFactory(true);
