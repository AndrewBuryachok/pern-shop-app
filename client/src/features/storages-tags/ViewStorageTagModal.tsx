import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageTag } from './storage-tag.model';
import { useSelectStorageTagStatesQuery } from './storages-tags.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parsePlace,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<StorageTag>;

export default function ViewStorageTagModal({ data: storageTag }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectStorageTagStatesQuery(
    storageTag.id,
  );

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={storageTag.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...storageTag.storage.card.user} />}
        iconWidth={48}
        value={parseCard(storageTag.storage.card)}
        readOnly
      />
      <TextInput
        label={t('columns.storage')}
        value={parsePlace(storageTag.storage)}
        readOnly
      />
      <TextInput label={t('columns.tag')} value={storageTag.name} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${storageTag.price} ${t('constants.currency')}`}
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
        value={parseTime(storageTag.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewStorageTagAction = {
  open: (storage: StorageTag) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.storages'),
      children: <ViewStorageTagModal data={storage} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
