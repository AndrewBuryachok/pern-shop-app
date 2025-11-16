import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomCarousel from '../../common/components/CustomCarousel';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Report>;

export default function ViewReportModal({ data: report }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={report.id} readOnly />
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
      {!!report.images.length && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomCarousel images={report.images} />
        </Input.Wrapper>
      )}
      <TextInput
        label={t('columns.created')}
        value={parseTime(report.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewReportAction = {
  open: (report: Report) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.reports'),
      children: <ViewReportModal data={report} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
