import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { StatesItem } from '../../common/components/StatesItem';
import { parseCard, viewContainers, viewStates } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Storage>;

export default function ViewStorageModal({ data: storage }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...storage.card.user} />}
        iconWidth={48}
        value={parseCard(storage.card)}
        disabled
      />
      <TextInput label={t('columns.storage')} value={storage.name} disabled />
      <TextInput label={t('columns.x')} value={storage.x} disabled />
      <TextInput label={t('columns.y')} value={storage.y} disabled />
      <TextInput
        label={t('columns.price')}
        value={`${storage.price}$`}
        disabled
      />
      <Select
        label={t('columns.prices')}
        placeholder={`${t('components.total')}: ${storage.states.length}`}
        itemComponent={StatesItem}
        data={viewStates(storage.states)}
        limit={20}
        searchable
      />
      <Select
        label={t('columns.cells')}
        placeholder={`${t('components.total')}: ${storage.cells.length}`}
        data={viewContainers(storage.cells)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewStorageAction = {
  open: (storage: Storage) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.storage'),
      children: <ViewStorageModal data={storage} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
