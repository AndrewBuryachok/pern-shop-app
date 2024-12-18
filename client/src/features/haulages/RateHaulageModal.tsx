import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import { useRateHaulageMutation } from './haulages.api';
import { RateHaulageDto } from './haulage.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Haulage>;

export default function RateHaulageModal({ data: haulage }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      haulageId: haulage.id,
      rate: 5,
    },
  });

  const [rateHaulage, { isLoading }] = useRateHaulageMutation();

  const handleSubmit = async (dto: RateHaulageDto) => {
    await rateHaulage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.haulages')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...haulage.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(haulage.executorCard!)}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateHaulageAction = {
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.haulages'),
      children: <RateHaulageModal data={haulage} />,
    }),
  disable: (haulage: Haulage) =>
    haulage.status !== Status.COMPLETED || !!haulage.rate,
  color: Color.YELLOW,
};
