import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditCityMutation } from './cities.api';
import { EditCityDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LINK_LENGTH,
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
      image: city.image,
      video: city.video,
      description: city.description,
      x: city.x,
      y: city.y,
    },
  });

  const [image] = useDebouncedValue(form.values.image, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

  const [editCity, { isLoading }] = useEditCityMutation();

  const handleSubmit = async (dto: EditCityDto) => {
    await editCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.cities')}
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
        label={t('columns.image')}
        placeholder={t('columns.image')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        description={t('information.video')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      <CustomVideo video={video} />
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

export const editCityFactory = (hasRole: boolean) => ({
  open: (city: City) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.cities'),
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
