import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditCityMutation } from './cities.api';
import { EditCityDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_NAME_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = IModal<City>;

export default function EditCityModal({ data: city }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      cityId: city.id,
      name: city.name,
      x: city.x,
      y: city.y,
    },
  });

  const [editCity, { isLoading }] = useEditCityMutation();

  const handleSubmit = async (dto: EditCityDto) => {
    await editCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.city')}
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

export const editCityFactory = (hasRole: boolean) => ({
  open: (city: City) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.city'),
      children: <EditCityModal data={city} />,
    }),
  disable: (city: City) => {
    const user = getCurrentUser()!;
    return city.user.id !== user.id && !hasRole;
  },
  color: Color.YELLOW,
});

export const editMyCityAction = editCityFactory(false);

export const editUserCityAction = editCityFactory(true);
