import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Bargain } from './bargain.model';
import { useDeleteBargainMutation } from './bargains.api';
import { DeleteBargainDto } from './bargain.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseBargainAmount, parseCard, parseItem } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Bargain>;

export default function DeleteBargainModal({ data: bargain }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      bargainId: bargain.id,
    },
  });

  const [deleteBargain, { isLoading }] = useDeleteBargainMutation();

  const handleSubmit = async (dto: DeleteBargainDto) => {
    await deleteBargain(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.bargains')}
    >
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...bargain.card.user} />}
        iconWidth={48}
        value={parseCard(bargain.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...bargain.good} />}
        iconWidth={48}
        value={parseItem(bargain.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={bargain.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseBargainAmount(bargain)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${bargain.amount * bargain.good.price} ${t(
          'constants.currency',
        )}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteBargainAction = {
  open: (bargain: Bargain) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.bargains'),
      children: <DeleteBargainModal data={bargain} />,
    }),
  disable: () => false,
  color: Color.RED,
};
