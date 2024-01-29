import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Annotation } from './annotation.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditAnnotationMutation } from './annotations.api';
import { EditAnnotationDto } from './annotation.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { isUserNotHasRole } from '../../common/utils';
import { Color, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = IModal<Annotation>;

export default function EditAnnotationModal({ data: annotation }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      annotationId: annotation.id,
      text: annotation.text,
    },
  });

  const [editAnnotation, { isLoading }] = useEditAnnotationMutation();

  const handleSubmit = async (dto: EditAnnotationDto) => {
    await editAnnotation(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.annotations')}
      isChanged={!form.isDirty()}
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
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const editAnnotationAction = {
  open: (annotation: Annotation) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.annotations'),
      children: <EditAnnotationModal data={annotation} />,
    }),
  disable: (annotation: Annotation) => {
    const user = getCurrentUser();
    return annotation.user.id !== user?.id && isUserNotHasRole(Role.ADMIN);
  },
  color: Color.YELLOW,
};
