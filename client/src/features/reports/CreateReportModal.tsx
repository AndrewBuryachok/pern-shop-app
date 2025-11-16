import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IconPhoto } from '@tabler/icons';
import {
  useCreateEndReportMutation,
  useCreateEventsReportMutation,
  useCreateHubReportMutation,
  useCreateServerReportMutation,
  useCreateSiteReportMutation,
  useCreateSpawnReportMutation,
} from './reports.api';
import { CreateReportDto } from './report.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomImage from '../../common/components/CustomImage';
import { MAX_TEXT_LENGTH, Role } from '../../common/constants';
import { uploadImage } from '../../common/utils';

type Props = { mark: number };

export default function CreateReportModal({ mark }: Props) {
  const [t] = useTranslation();

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      text: '',
      image1: '',
      image2: '',
      image3: '',
    },
  });

  useEffect(() => {
    if (image) {
      uploadImage(image).then((link) =>
        link
          ? form.setFieldValue('image1', link)
          : setImageError(t('errors.failed_upload_image')),
      );
    } else {
      setImageError(null);
    }
  }, [image]);

  const [createReport, { isLoading }] = [
    useCreateServerReportMutation,
    useCreateSiteReportMutation,
    useCreateEventsReportMutation,
    useCreateSpawnReportMutation,
    useCreateHubReportMutation,
    useCreateEndReportMutation,
  ][mark]();

  const handleSubmit = async (dto: CreateReportDto) => {
    await createReport(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.reports')}
    >
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <FileInput
        label={t('columns.image')}
        placeholder={t('columns.image')}
        icon={<IconPhoto size={16} />}
        value={image}
        onChange={setImage}
        error={imageError}
        clearable
        accept='image/jpeg,image/jpg,image/gif,image/png'
      />
      {form.values.image1 && <CustomImage image={form.values.image1} />}
    </CustomForm>
  );
}

export const createReportFactory = (mark: number) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.reports'),
      children: <CreateReportModal mark={mark} />,
    }),
  role: [
    Role.INSPECTOR,
    Role.INSPECTOR,
    undefined,
    Role.SPAWN,
    Role.HUB,
    Role.END,
  ][mark],
});

export const createServerReportButton = createReportFactory(0);

export const createSiteReportButton = createReportFactory(1);

export const createEventsReportButton = createReportFactory(2);

export const createSpawnReportButton = createReportFactory(3);

export const createHubReportButton = createReportFactory(4);

export const createEndReportButton = createReportFactory(5);
