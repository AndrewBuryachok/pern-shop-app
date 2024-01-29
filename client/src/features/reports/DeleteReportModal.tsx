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
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
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
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={report.image1} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={report.image2} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={report.image3} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={report.video} />
      </Input.Wrapper>
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
    return isUserNotHasRole(Role.ADMIN) && report.user.id !== user?.id;
  },
  color: Color.RED,
};
