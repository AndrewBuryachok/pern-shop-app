import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Hire } from './hire.model';
import { useSelectHireThingsQuery } from './hires.api';
import RefetchAction from '../../common/components/RefetchAction';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import { viewThings } from '../../common/utils';

type Props = IModal<Hire>;

export default function ViewHireThingsModal({ data: hire }: Props) {
  const [t] = useTranslation();

  const { data: things, ...thingsResponse } = useSelectHireThingsQuery(hire.id);

  return (
    <Select
      label={t('columns.things')}
      placeholder={`${t('components.total')}: ${hire.deliveries + hire.orders}`}
      rightSection={<RefetchAction {...thingsResponse} />}
      itemComponent={ThingsItemWithAmount}
      data={viewThings(things || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewHireThingsAction = (hire: Hire) =>
  openModal({
    title: t('columns.things'),
    children: <ViewHireThingsModal data={hire} />,
  });
