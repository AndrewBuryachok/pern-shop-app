import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import { useSelectStorageStatesQuery } from './storages.api';
import { useSelectStorageCellsQuery } from '../cells/cells.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { StatesItem } from '../../common/components/StatesItem';
import { parseCard, viewContainers, viewStates } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Storage>;

export default function ViewStorageModal({ data: storage }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectStorageStatesQuery(
    storage.id,
  );
  const { data: cells, ...cellsResponse } = useSelectStorageCellsQuery(
    storage.id,
  );

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={storage.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...storage.card.user} />}
        iconWidth={48}
        value={parseCard(storage.card)}
        disabled
      />
      <TextInput label={t('columns.storage')} value={storage.name} disabled />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage {...storage} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={storage.description || '-'}
        disabled
      />
      <TextInput label={t('columns.x')} value={storage.x} disabled />
      <TextInput label={t('columns.y')} value={storage.y} disabled />
      <TextInput
        label={t('columns.price')}
        value={`${storage.price}$`}
        disabled
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
      <Select
        label={t('columns.cells')}
        placeholder={`${t('components.total')}: ${cells?.length || 0}`}
        rightSection={<RefetchAction {...cellsResponse} />}
        data={viewContainers(cells || [])}
        limit={20}
        searchable
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
