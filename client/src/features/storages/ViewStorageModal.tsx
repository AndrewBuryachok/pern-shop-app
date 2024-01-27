import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import { useSelectStorageStatesQuery } from './storages.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { StatesItem } from '../../common/components/StatesItem';
import { parseCard, parseTime, viewStates } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Storage>;

export default function ViewStorageModal({ data: storage }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectStorageStatesQuery(
    storage.id,
  );

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
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={storage.image} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={storage.video} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={storage.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={storage.x} readOnly />
      <TextInput label={t('columns.y')} value={storage.y} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${storage.price} ${t('constants.currency')}`}
        readOnly
      />
      <Select
        label={t('columns.prices')}
        placeholder={`${t('components.total')}: ${states?.length || 0}`}
        rightSection={<RefetchAction {...statesResponse} />}
        itemComponent={StatesItem}
        data={viewStates(states || [])}
        limit={20}
        searchable
      />
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
