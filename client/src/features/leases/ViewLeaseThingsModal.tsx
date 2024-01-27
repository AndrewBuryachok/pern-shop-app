import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import { useSelectLeaseThingsQuery } from './leases.api';
import RefetchAction from '../../common/components/RefetchAction';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import { viewThings } from '../../common/utils';

type Props = IModal<Lease>;

export default function ViewLeaseThingsModal({ data: lease }: Props) {
  const [t] = useTranslation();

  const { data: things, ...thingsResponse } = useSelectLeaseThingsQuery(
    lease.id,
  );

  return (
    <Select
      label={t('columns.things')}
      placeholder={`${t('components.total')}: 1`}
      rightSection={<RefetchAction {...thingsResponse} />}
      itemComponent={ThingsItemWithAmount}
      data={viewThings(things || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewLeaseThingsAction = (lease: Lease) =>
  openModal({
    title: t('columns.things'),
    children: <ViewLeaseThingsModal data={lease} />,
  });
