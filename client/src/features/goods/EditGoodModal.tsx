import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useEditGoodMutation } from './goods.api';
import { EditGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import {
  Color,
  MAX_AMOUNT_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = IModal<Good>;

export default function EditGoodModal({ data: good }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      goodId: good.id,
      amount: good.amount,
      price: good.price,
    },
  });

  const [editGood, { isLoading }] = useEditGoodMutation();

  const handleSubmit = async (dto: EditGoodDto) => {
    await editGood(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.goods')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(good.shop.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...good} />}
        iconWidth={48}
        value={parseItem(good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(good)}
        readOnly
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={0}
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

export const editGoodAction = {
  open: (good: Good) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.goods'),
      children: <EditGoodModal data={good} />,
    }),
  disable: (good: Good) => !!good.completedAt,
  color: Color.YELLOW,
};
