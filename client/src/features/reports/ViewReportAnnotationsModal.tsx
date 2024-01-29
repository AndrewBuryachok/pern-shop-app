import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateAnnotationMutation } from '../annotations/annotations.api';
import { useSelectReportAnnotationsQuery } from './reports.api';
import { CreateAnnotationDto } from '../annotations/annotation.dto';
import CustomForm from '../../common/components/CustomForm';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import { editAnnotationAction } from '../annotations/EditAnnotationModal';
import { deleteAnnotationAction } from '../annotations/DeleteAnnotationModal';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Report>;

export default function ViewReportAnnotationsModal({ data: report }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const form = useForm({
    initialValues: {
      reportId: report.id,
      annotationId: 0,
      text: '',
    },
  });

  const [createAnnotation, { isLoading }] = useCreateAnnotationMutation();

  const handleSubmit = async (dto: CreateAnnotationDto) => {
    await createAnnotation(dto);
  };

  const response = useSelectReportAnnotationsQuery(report.id);

  const annotation = response.data?.find(
    (annotation) => annotation.id === form.values.annotationId,
  );

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      isChanged={!user}
      text={t('actions.create') + ' ' + t('modals.annotations')}
    >
      <RepliesTimeline
        {...response}
        actions={[
          {
            open: (reply: Reply) =>
              form.setFieldValue(
                'annotationId',
                reply.id === form.values.annotationId ? 0 : reply.id,
              ),
            disable: () => false,
            color: Color.GREEN,
          },
          editAnnotationAction,
          deleteAnnotationAction,
        ]}
      />
      {annotation && <ReplyAvatarWithText {...annotation} />}
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const openViewReportAnnotationsModal = (report: Report) =>
  openModal({
    title: t('columns.annotations'),
    children: <ViewReportAnnotationsModal data={report} />,
  });
