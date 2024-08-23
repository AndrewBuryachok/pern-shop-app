import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Farm } from './farm.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Farm>;

export default function ViewFarmModal({ data: farm }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={farm.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...farm.user} />}
        iconWidth={48}
        value={farm.user.nick}
        readOnly
      />
      <TextInput label={t('columns.farm')} value={farm.name} readOnly />
      {farm.image && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={farm.image} />
        </Input.Wrapper>
      )}
      {farm.video && (
        <Input.Wrapper label={t('columns.video')}>
          <CustomVideo video={farm.video} />
        </Input.Wrapper>
      )}
      <Textarea
        label={t('columns.description')}
        value={farm.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={farm.x} readOnly />
      <TextInput label={t('columns.y')} value={farm.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(farm.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewFarmAction = {
  open: (farm: Farm) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.farms'),
      children: <ViewFarmModal data={farm} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
