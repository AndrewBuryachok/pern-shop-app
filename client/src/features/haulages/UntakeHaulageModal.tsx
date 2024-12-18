import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import { useUntakeHaulageMutation } from './haulages.api';
import { HaulageIdDto } from './haulage.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Haulage>;

export default function UntakeHaulageModal({ data: haulage }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      haulageId: haulage.id,
    },
  });

  const [untakeHaulage, { isLoading }] = useUntakeHaulageMutation();

  const handleSubmit = async (dto: HaulageIdDto) => {
    await untakeHaulage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.untake') + ' ' + t('modals.haulage')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...haulage.fromHire.card.user} />}
        iconWidth={48}
        value={parseCard(haulage.fromHire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...haulage} />}
        iconWidth={48}
        value={parseItem(haulage.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={haulage.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(haulage)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${haulage.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const untakeHaulageAction = {
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.untake') + ' ' + t('modals.haulage'),
      children: <UntakeHaulageModal data={haulage} />,
    }),
  disable: (haulage: Haulage) => haulage.status !== Status.TAKEN,
  color: Color.RED,
};
