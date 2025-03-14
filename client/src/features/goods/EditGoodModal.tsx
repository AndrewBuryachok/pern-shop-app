import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useEditGoodMutation } from './goods.api';
import { EditGoodDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingsItem';
import { parseCard, selectItems, selectKits } from '../../common/utils';
import {
  Color,
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = IModal<Good>;

export default function EditGoodModal({ data: good }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      goodId: good.id,
      item: `${good.item}`,
      description: good.description,
      amount: good.amount,
      intake: good.intake,
      kit: `${good.kit}`,
      price: good.price,
    },
    transformValues: ({ item, kit, ...rest }) => ({
      ...rest,
      item: +item,
      kit: +kit,
    }),
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
        icon={<CustomAvatar {...good.card.user} />}
        iconWidth={48}
        value={parseCard(good.card)}
        readOnly
      />
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={+form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems()}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
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
        label={t('columns.intake')}
        placeholder={t('columns.intake')}
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label={t('columns.kit')}
        placeholder={t('columns.kit')}
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
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
  disable: (good: Good) => !!good.purchases,
  color: Color.YELLOW,
};
