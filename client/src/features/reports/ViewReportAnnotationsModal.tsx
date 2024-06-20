import { useTranslation } from 'react-i18next';
import { ActionIcon, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateAnnotationMutation } from '../annotations/annotations.api';
import { useSelectReportAnnotationsQuery } from './reports.api';
import { CreateAnnotationDto } from '../annotations/annotation.dto';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import ReplyAvatarWithClose from '../../common/components/ReplyAvatarWithClose';
import CustomAnchor from '../../common/components/CustomAnchor';
import { editAnnotationAction } from '../annotations/EditAnnotationModal';
import { deleteAnnotationAction } from '../annotations/DeleteAnnotationModal';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Report>;

export default function ViewReportAnnotationsModal({ data: report }: Props) {
  const [t] = useTranslation();

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      reportId: report.id,
      annotationId: 0,
      text: '',
    },
  });

  const user = getCurrentUser();

  const [createAnnotation, { isLoading }] = useCreateAnnotationMutation();

  const handleSubmit = async (dto: CreateAnnotationDto) => {
    await createAnnotation(dto);
    form.reset();
  };

  const response = useSelectReportAnnotationsQuery(report.id, {
    skip: !opened,
  });

  const annotation = response.data?.find(
    (annotation) => annotation.id === form.values.annotationId,
  );

  return (
    <>
      {opened ? (
        <RepliesTimeline
          {...response}
          actions={[editAnnotationAction, deleteAnnotationAction]}
          reply={(reply: Reply) => form.setFieldValue('annotationId', reply.id)}
        />
      ) : (
        report.annotation && <ReplyAvatarWithText {...report.annotation} />
      )}
      {!!report.annotations && (
        <CustomAnchor
          text={
            (opened ? t('actions.hide') : t('actions.view')) +
            ' ' +
            t('pages.all').toLowerCase() +
            ' ' +
            t('columns.annotations').toLowerCase()
          }
          open={toggle}
        />
      )}
      {annotation && (
        <ReplyAvatarWithClose
          {...annotation}
          close={() => form.setFieldValue('annotationId', 0)}
        />
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          placeholder={t('columns.reply')}
          rightSection={
            <ActionIcon size={24} type='submit' disabled={!user || isLoading}>
              <IconSend size={16} />
            </ActionIcon>
          }
          required
          autosize
          maxLength={MAX_TEXT_LENGTH}
          {...form.getInputProps('text')}
        />
      </form>
    </>
  );
}
