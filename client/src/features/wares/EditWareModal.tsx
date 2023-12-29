import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import { useEditWareMutation } from './wares.api';
import { EditWareDto } from './ware.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import {
  Color,
  MAX_AMOUNT_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = IModal<Ware>;

export default function EditWareModal({ data: ware }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      wareId: ware.id,
      amount: ware.amount,
      price: ware.price,
    },
  });

  const [editWare, { isLoading }] = useEditWareMutation();

  const handleSubmit = async (dto: EditWareDto) => {
    await editWare(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.wares')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...ware} />}
        iconWidth={48}
        value={parseItem(ware.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={ware.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(ware)}
        disabled
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
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

export const editWareAction = {
  open: (ware: Ware) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.wares'),
      children: <EditWareModal data={ware} />,
    }),
  disable: (ware: Ware) => !!ware.completedAt,
  color: Color.YELLOW,
};
