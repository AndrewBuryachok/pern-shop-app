import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtUser } from './user.model';
import { useSelectUserRatersQuery } from './users.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<ExtUser>;

export default function ViewUserRatersModal({ data: user }: Props) {
  const [t] = useTranslation();

  const { data: raters, ...ratersResponse } = useSelectUserRatersQuery(user.id);

  return (
    <Stack spacing={8}>
      <Select
        label={t('columns.raters')}
        placeholder={`${t('components.total')}: ${raters?.length || 0}`}
        rightSection={<RefetchAction {...ratersResponse} />}
        itemComponent={UsersItem}
        data={viewUsers(raters || [])}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const openViewUserRatersModal = (user: ExtUser) =>
  openModal({
    title: t('columns.raters'),
    children: <ViewUserRatersModal data={user} />,
  });
