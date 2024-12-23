import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from '../towns/town.model';
import { useRejectInvitationMutation } from './invitations.api';
import { TownIdDto } from '../towns/town.dto';
import CustomForm from '../../common/components/CustomForm';
import { parsePlace } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Town>;

export default function RejectInvitationModal({ data: town }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      townId: town.id,
    },
  });

  const [cancelInvitation, { isLoading }] = useRejectInvitationMutation();

  const handleSubmit = async (dto: TownIdDto) => {
    await cancelInvitation(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.reject') + ' ' + t('modals.invitations')}
    >
      <TextInput label={t('columns.town')} value={parsePlace(town)} readOnly />
    </CustomForm>
  );
}

export const rejectInvitationAction = {
  open: (town: Town) =>
    openModal({
      title: t('actions.reject') + ' ' + t('modals.invitations'),
      children: <RejectInvitationModal data={town} />,
    }),
  disable: () => false,
  color: Color.RED,
};
