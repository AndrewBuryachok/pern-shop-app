import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  CloseButton,
  Group,
  Input,
  Rating,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import { useCompleteHaulageMutation } from './haulages.api';
import { CompleteHaulageDto } from './haulage.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Haulage>;

export default function CompleteHaulageModal({ data: haulage }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      haulageId: haulage.id,
      rate: 0,
    },
  });

  const [completeHaulage, { isLoading }] = useCompleteHaulageMutation();

  const handleSubmit = async (dto: CompleteHaulageDto) => {
    await completeHaulage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.haulages')}
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
      <Input.Wrapper label={t('columns.rate')}>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
    </CustomForm>
  );
}

export const completeHaulageAction = {
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.haulages'),
      children: <CompleteHaulageModal data={haulage} />,
    }),
  disable: (haulage: Haulage) => haulage.status !== Status.EXECUTED,
  color: Color.GREEN,
};
