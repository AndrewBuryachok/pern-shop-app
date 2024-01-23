import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyCityMutation,
  useCreateUserCityMutation,
} from './cities.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreateCityDto } from './city.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import {
  MAX_COORDINATE_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LINK_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateCityModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      name: '',
      image: '',
      video: '',
      description: '',
      x: 0,
      y: 0,
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const [image] = useDebouncedValue(form.values.image, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createCity, { isLoading }] = hasRole
    ? useCreateUserCityMutation()
    : useCreateMyCityMutation();

  const handleSubmit = async (dto: ExtCreateCityDto) => {
    await createCity(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.cities')}
    >
      {hasRole && (
        <Select
          label={t('columns.user')}
          placeholder={t('columns.user')}
          icon={user && <CustomAvatar {...user} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <TextInput
        label={t('columns.name')}
        placeholder={t('columns.name')}
        required
        minLength={MIN_NAME_LENGTH}
        maxLength={MAX_NAME_LENGTH}
        {...form.getInputProps('name')}
      />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      <CustomVideo video={video} />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.x')}
        placeholder={t('columns.x')}
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('x')}
      />
      <NumberInput
        label={t('columns.y')}
        placeholder={t('columns.y')}
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('y')}
      />
    </CustomForm>
  );
}

export const createCityFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.cities'),
      children: <CreateCityModal hasRole={hasRole} />,
    }),
});

export const createMyCityButton = createCityFactory(false);

export const createUserCityButton = createCityFactory(true);
