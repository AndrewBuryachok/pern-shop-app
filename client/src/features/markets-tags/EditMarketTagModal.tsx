import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketTag } from './market-tag.model';
import { useEditMarketTagMutation } from './markets-tags.api';
import { EditMarketTagDto } from './market-tag.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_NAME_LENGTH,
  MAX_PRICE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = IModal<MarketTag>;

export default function EditMarketTagModal({ data: marketTag }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      marketTagId: marketTag.id,
      name: marketTag.name,
      price: marketTag.price,
    },
  });

  const [editMarketTag, { isLoading }] = useEditMarketTagMutation();

  const handleSubmit = async (dto: EditMarketTagDto) => {
    await editMarketTag(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.tags')}
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

export const editMarketTagAction = {
  open: (marketTag: MarketTag) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.tags'),
      children: <EditMarketTagModal data={marketTag} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
