import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Advert } from './advert.model';
import { useEditAdvertMutation } from './adverts.api';
import { EditAdvertDto } from './advert.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_DESCRIPTION_LENGTH,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = IModal<Advert>;

export default function EditAdvertModal({ data: advert }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      advertId: advert.id,
      description: advert.description,
      price: advert.price,
    },
  });

  const [editAdvert, { isLoading }] = useEditAdvertMutation();

  const handleSubmit = async (dto: EditAdvertDto) => {
    await editAdvert(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.adverts')}
      isChanged={!form.isDirty()}
    >
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editAdvertAction = {
  open: (advert: Advert) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.adverts'),
      children: <EditAdvertModal data={advert} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
