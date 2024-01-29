import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Annotation } from './annotation.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteAnnotationMutation } from './annotations.api';
import { DeleteAnnotationDto } from './annotation.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, Role } from '../../common/constants';

type Props = IModal<Annotation>;

export default function DeleteAnnotationModal({ data: annotation }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      annotationId: annotation.id,
    },
  });

  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation();

  const handleSubmit = async (dto: DeleteAnnotationDto) => {
    await deleteAnnotation(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.annotations')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...annotation.user} />}
        iconWidth={48}
        value={annotation.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        value={annotation.text}
        autosize
        readOnly
      />
    </CustomForm>
  );
}

export const deleteAnnotationAction = {
  open: (annotation: Annotation) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.annotations'),
      children: <DeleteAnnotationModal data={annotation} />,
    }),
  disable: (annotation: Annotation) => {
    const user = getCurrentUser();
    return annotation.user.id !== user?.id && isUserNotHasRole(Role.ADMIN);
  },
  color: Color.RED,
};
