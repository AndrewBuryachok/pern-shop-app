import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Advert } from './advert.model';
import { useDeleteAdvertMutation } from './adverts.api';
import { DeleteAdvertDto } from './advert.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Advert>;

export default function DeleteAdvertModal({ data: advert }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      advertId: advert.id,
    },
  });

  const [deleteAdvert, { isLoading }] = useDeleteAdvertMutation();

  const handleSubmit = async (dto: DeleteAdvertDto) => {
    await deleteAdvert(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.adverts')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...advert.card.user} />}
        iconWidth={48}
        value={parseCard(advert.card)}
        readOnly
      />
      <Textarea
        label={t('columns.activity')}
        value={advert.activity}
        readOnly
      />
      <Textarea label={t('columns.text')} value={advert.text} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${advert.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteAdvertAction = {
  open: (advert: Advert) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.adverts'),
      children: <DeleteAdvertModal data={advert} />,
    }),
  disable: () => false,
  color: Color.RED,
};
