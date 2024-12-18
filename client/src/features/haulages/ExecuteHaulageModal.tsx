import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import { useExecuteHaulageMutation } from './haulages.api';
import { HaulageIdDto } from './haulage.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Haulage>;

export default function ExecuteHaulageModal({ data: haulage }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      haulageId: haulage.id,
    },
  });

  const [executeHaulage, { isLoading }] = useExecuteHaulageMutation();

  const handleSubmit = async (dto: HaulageIdDto) => {
    await executeHaulage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.execute') + ' ' + t('modals.haulages')}
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

export const executeHaulageAction = {
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.execute') + ' ' + t('modals.haulages'),
      children: <ExecuteHaulageModal data={haulage} />,
    }),
  disable: (haulage: Haulage) => haulage.status !== Status.TAKEN,
  color: Color.GREEN,
};
