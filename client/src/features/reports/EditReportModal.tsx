import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
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
import CustomVideo from '../../common/components/CustomVideo';
import { isUserNotHasRole } from '../../common/utils';
import {
  Color,
  MAX_LINK_LENGTH,
  MAX_TEXT_LENGTH,
  Role,
} from '../../common/constants';

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
      video: report.video,
    },
  });

  const [image1] = useDebouncedValue(form.values.image1, 500);
  const [image2] = useDebouncedValue(form.values.image2, 500);
  const [image3] = useDebouncedValue(form.values.image3, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

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
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image1')}
      />
      <CustomImage image={image1} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image2')}
      />
      <CustomImage image={image2} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image3')}
      />
      <CustomImage image={image3} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        description={t('information.video')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      <CustomVideo video={video} />
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
    return isUserNotHasRole(Role.ADMIN) && report.user.id !== user?.id;
  },
  color: Color.YELLOW,
};
