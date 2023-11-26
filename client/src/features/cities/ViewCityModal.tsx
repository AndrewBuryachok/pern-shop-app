import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function ViewCityModal({ data: city }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...city.user} />}
        iconWidth={48}
        value={city.user.name}
        disabled
      />
      <TextInput label={t('columns.city')} value={city.name} disabled />
      <TextInput label={t('columns.x')} value={city.x} disabled />
      <TextInput label={t('columns.y')} value={city.y} disabled />
      <Select
        label={t('columns.users')}
        placeholder={`${t('components.total')}: ${city.users.length}`}
        itemComponent={UsersItem}
        data={viewUsers(city.users)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewCityAction = {
  open: (city: City) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.city'),
      children: <ViewCityModal data={city} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
