import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseButton, FileInput, Group, Input, Textarea } from '@mantine/core';
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
import CustomCarousel from '../../common/components/CustomCarousel';
import {
  MAX_IMAGES_LENGTH,
  MAX_TEXT_LENGTH,
  Role,
} from '../../common/constants';
import { uploadImage } from '../../common/utils';

type Props = { mark: number };

export default function CreateReportModal({ mark }: Props) {
  const [t] = useTranslation();

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      text: '',
      images: [] as string[],
    },
  });

  useEffect(() => {
    if (image) {
      uploadImage(image).then((link) =>
        link
          ? form.setFieldValue('images', [...form.values.images, link])
          : setImageError(t('errors.failed_upload_image')),
      );
    } else {
      setImageError(null);
    }
  }, [image]);

  useEffect(() => {
    setImage(null);
  }, [form.values.images]);

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
      {!!form.values.images.length && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomCarousel images={form.values.images} />
        </Input.Wrapper>
      )}
      {!!form.values.images.length && (
        <Group spacing={8} position='center'>
          {form.values.images.map((image) => (
            <CloseButton
              key={image}
              size={24}
              iconSize={16}
              onClick={() =>
                form.setFieldValue(
                  'images',
                  form.values.images.filter((i) => i !== image),
                )
              }
            />
          ))}
        </Group>
      )}
      {form.values.images.length < MAX_IMAGES_LENGTH && (
        <FileInput
          label={t('columns.image')}
          placeholder={t('columns.image')}
          icon={<IconPhoto size={16} />}
          value={image}
          onChange={setImage}
          error={imageError}
          accept='image/jpeg,image/jpg,image/gif,image/png'
        />
      )}
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
