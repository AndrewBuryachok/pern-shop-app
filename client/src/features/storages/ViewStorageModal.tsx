import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Storage>;

export default function ViewStorageModal({ data: storage }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={storage.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...storage.card.user} />}
        iconWidth={48}
        value={parseCard(storage.card)}
        readOnly
      />
      <TextInput label={t('columns.storage')} value={storage.name} readOnly />
      {storage.image && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={storage.image} />
        </Input.Wrapper>
      )}
      {storage.video && (
        <Input.Wrapper label={t('columns.video')}>
          <CustomVideo video={storage.video} />
        </Input.Wrapper>
      )}
      <Textarea
        label={t('columns.description')}
        value={storage.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={storage.x} readOnly />
      <TextInput label={t('columns.y')} value={storage.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(storage.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewStorageAction = {
  open: (storage: Storage) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.storages'),
      children: <ViewStorageModal data={storage} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
