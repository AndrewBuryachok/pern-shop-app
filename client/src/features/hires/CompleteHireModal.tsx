import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Hire } from './hire.model';
import { useCompleteHireMutation } from './hires.api';
import { HireIdDto } from './hire.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseDrawer } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Hire>;

export default function CompleteHireModal({ data: hire }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      hireId: hire.id,
    },
  });

  const [completeHire, { isLoading }] = useCompleteHireMutation();

  const handleSubmit = async (dto: HireIdDto) => {
    await completeHire(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.hires')}
    >
      <TextInput
        label={t('columns.tenant')}
        icon={<CustomAvatar {...hire.card.user} />}
        iconWidth={48}
        value={parseCard(hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...hire.drawer.station.card.user} />}
        iconWidth={48}
        value={parseCard(hire.drawer.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parseDrawer(hire.drawer)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${hire.sum} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const completeHireAction = {
  open: (hire: Hire) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.hires'),
      children: <CompleteHireModal data={hire} />,
    }),
  disable: (hire: Hire) => new Date(hire.completedAt) < new Date(),
  color: Color.RED,
};
