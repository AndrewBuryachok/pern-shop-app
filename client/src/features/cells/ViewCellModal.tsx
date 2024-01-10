import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Cell } from './cell.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parsePlace, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Cell>;

export default function ViewCellModal({ data: cell }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={cell.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.storage')}
        value={parsePlace(cell.storage)}
        disabled
      />
      <TextInput label={t('columns.cell')} value={`#${cell.name}`} disabled />
      <TextInput
        label={t('columns.price')}
        value={`${cell.storage.price} ${t('constants.currency')}`}
        disabled
      />
      <TextInput
        label={t('columns.reserved')}
        value={parseTime(cell.reservedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewCellAction = {
  open: (cell: Cell) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.cells'),
      children: <ViewCellModal data={cell} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
