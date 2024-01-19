import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditShopMutation } from './shops.api';
import { EditShopDto } from './shop.dto';
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

type Props = IModal<Shop>;

export default function EditShopModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      shopId: shop.id,
      name: shop.name,
      image: shop.image,
      video: shop.video,
      description: shop.description,
      x: shop.x,
      y: shop.y,
    },
  });

  const [image] = useDebouncedValue(form.values.image, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

  const [editShop, { isLoading }] = useEditShopMutation();

  const handleSubmit = async (dto: EditShopDto) => {
    await editShop(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.shops')}
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
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
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

export const editShopFactory = (hasRole: boolean) => ({
  open: (shop: Shop) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.shops'),
      children: <EditShopModal data={shop} />,
    }),
  disable: (shop: Shop) => {
    const user = getCurrentUser()!;
    return shop.user.id !== user.id && !hasRole;
  },
  color: Color.YELLOW,
});

export const editMyShopAction = editShopFactory(false);

export const editUserShopAction = editShopFactory(true);
