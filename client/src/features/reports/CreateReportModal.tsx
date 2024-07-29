import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
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
import CustomVideo from '../../common/components/CustomVideo';
import { MAX_LINK_LENGTH, MAX_TEXT_LENGTH, Role } from '../../common/constants';

type Props = { mark: number };

export default function CreateReportModal({ mark }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      text: '',
      image1: '',
      image2: '',
      image3: '',
      video: '',
    },
  });

  const [image1] = useDebouncedValue(form.values.image1, 500);
  const [image2] = useDebouncedValue(form.values.image2, 500);
  const [image3] = useDebouncedValue(form.values.image3, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

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
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        autosize
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image1')}
      />
      {image1 && <CustomImage image={image1} />}
      {image1 && (
        <Textarea
          label={t('columns.image')}
          placeholder={t('columns.image')}
          autosize
          maxLength={MAX_LINK_LENGTH}
          {...form.getInputProps('image2')}
        />
      )}
      {image2 && <CustomImage image={image2} />}
      {image2 && (
        <Textarea
          label={t('columns.image')}
          placeholder={t('columns.image')}
          autosize
          maxLength={MAX_LINK_LENGTH}
          {...form.getInputProps('image3')}
        />
      )}
      {image3 && <CustomImage image={image3} />}
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        autosize
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      {video && <CustomVideo video={video} />}
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
