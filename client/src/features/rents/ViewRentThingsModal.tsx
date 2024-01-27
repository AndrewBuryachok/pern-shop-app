import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import { useSelectRentThingsQuery } from './rents.api';
import RefetchAction from '../../common/components/RefetchAction';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import { viewThings } from '../../common/utils';

type Props = IModal<Rent>;

export default function ViewRentThingsModal({ data: rent }: Props) {
  const [t] = useTranslation();

  const { data: things, ...thingsResponse } = useSelectRentThingsQuery(rent.id);

  return (
    <Select
      label={t('columns.things')}
      placeholder={`${t('components.total')}: ${things?.length || 0}`}
      rightSection={<RefetchAction {...thingsResponse} />}
      itemComponent={ThingsItemWithAmount}
      data={viewThings(things || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewRentThingsAction = (rent: Rent) =>
  openModal({
    title: t('columns.things'),
    children: <ViewRentThingsModal data={rent} />,
  });
