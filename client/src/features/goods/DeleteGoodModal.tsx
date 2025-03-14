import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useDeleteGoodMutation } from './goods.api';
import { GoodIdDto } from './good.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Good>;

export default function DeleteGoodModal({ data: good }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      goodId: good.id,
    },
  });

  const [deleteGood, { isLoading }] = useDeleteGoodMutation();

  const handleSubmit = async (dto: GoodIdDto) => {
    await deleteGood(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.goods')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...good.card.user} />}
        iconWidth={48}
        value={parseCard(good.card)}
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
      <TextInput
        label={t('columns.price')}
        value={`${good.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteGoodAction = {
  open: (good: Good) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.goods'),
      children: <DeleteGoodModal data={good} />,
    }),
  disable: (good: Good) => !!good.purchases,
  color: Color.RED,
};
