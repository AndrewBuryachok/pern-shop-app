import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { useEditShopMutation } from './shops.api';
import { EditShopDto } from './shop.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
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
      x: shop.x,
      y: shop.y,
    },
  });

  const [editShop, { isLoading }] = useEditShopMutation();

  const handleSubmit = async (dto: EditShopDto) => {
    await editShop(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.shop')}
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

export const editShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.shop'),
      children: <EditShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
