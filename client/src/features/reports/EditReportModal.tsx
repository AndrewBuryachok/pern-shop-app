import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditReportMutation } from './reports.api';
import { EditReportDto } from './report.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { isUserNotHasRole } from '../../common/utils';
import { Color, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = IModal<Report>;

export default function EditReportModal({ data: report }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      reportId: report.id,
      text: report.text,
      image1: report.image1,
      image2: report.image2,
      image3: report.image3,
    },
  });

  const [editReport, { isLoading }] = useEditReportMutation();

  const handleSubmit = async (dto: EditReportDto) => {
    await editReport(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.reports')}
      isChanged={!form.isDirty()}
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
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      {report.image1 && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={report.image1} />
        </Input.Wrapper>
      )}
      {report.image2 && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={report.image2} />
        </Input.Wrapper>
      )}
      {report.image3 && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={report.image3} />
        </Input.Wrapper>
      )}
    </CustomForm>
  );
}

export const editReportAction = {
  open: (report: Report) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.reports'),
      children: <EditReportModal data={report} />,
    }),
  disable: (report: Report) => {
    const user = getCurrentUser();
    return isUserNotHasRole(Role.INSPECTOR) && report.user.id !== user?.id;
  },
  color: Color.YELLOW,
};
