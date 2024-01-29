import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
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
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={report.image1} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={report.image2} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={report.image3} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={report.video} />
      </Input.Wrapper>
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
