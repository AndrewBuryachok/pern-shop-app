import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteReportMutation } from './reports.api';
import { DeleteReportDto } from './report.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomCarousel from '../../common/components/CustomCarousel';
import { isUserNotHasRole } from '../../common/utils';
import { Color, Role } from '../../common/constants';

type Props = IModal<Report>;

export default function DeleteReportModal({ data: report }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      reportId: report.id,
    },
  });

  const [deleteReport, { isLoading }] = useDeleteReportMutation();

  const handleSubmit = async (dto: DeleteReportDto) => {
    await deleteReport(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.reports')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...report.user} />}
        iconWidth={48}
        value={report.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        value={report.text}
        autosize
        readOnly
      />
      {!!report.images.length && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomCarousel images={report.images} />
        </Input.Wrapper>
      )}
    </CustomForm>
  );
}

export const deleteReportAction = {
  open: (report: Report) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.reports'),
      children: <DeleteReportModal data={report} />,
    }),
  disable: (report: Report) => {
    const user = getCurrentUser();
    return isUserNotHasRole(Role.INSPECTOR) && report.user.id !== user?.id;
  },
  color: Color.RED,
};
