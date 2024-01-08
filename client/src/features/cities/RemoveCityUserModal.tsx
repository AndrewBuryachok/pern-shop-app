import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useRemoveCityUserMutation,
  useSelectCityUsersQuery,
} from './cities.api';
import { UpdateCityUserDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { parsePlace, selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function RemoveCityUserModal({ data: city }: Props) {
  const [t] = useTranslation();

  const { data: cityUsers } = useSelectCityUsersQuery(city.id);

  const form = useForm({
    initialValues: {
      cityId: city.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const user = cityUsers?.find((user) => user.id === +form.values.user);

  const [removeCityUser, { isLoading }] = useRemoveCityUserMutation();

  const handleSubmit = async (dto: UpdateCityUserDto) => {
    await removeCityUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.city')} value={parsePlace(city)} disabled />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(cityUsers).filter((user) => user.id !== city.user.id)}
        limit={20}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeCityUserFactory = (hasRole: boolean) => ({
  open: (city: City) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.users'),
      children: <RemoveCityUserModal data={city} />,
    }),
  disable: (city: City) => {
    const user = getCurrentUser()!;
    return (city.user.id !== user.id && !hasRole) || city.users === 1;
  },
  color: Color.RED,
});

export const removeMyCityUserAction = removeCityUserFactory(false);

export const removeUserCityUserAction = removeCityUserFactory(true);
