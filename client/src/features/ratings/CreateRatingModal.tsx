import { CloseButton, Group, Input, Rating, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { ExtUser } from '../users/user.model';
import { useCreateRatingMutation } from './ratings.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { CreateRatingDto } from './rating.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = {
  data?: ExtUser;
};

export default function CreateRatingModal({ data }: Props) {
  const form = useForm({
    initialValues: {
      user: data?.id ? `${data.id}` : '',
      rate: data?.rating ? Math.round(data.rating) : 0,
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [createRating, { isLoading }] = useCreateRatingMutation();

  const handleSubmit = async (dto: CreateRatingDto) => {
    await createRating(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create rating'}
    >
      <Select
        label='User'
        placeholder='User'
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
      <Input.Wrapper label='Rate' required>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
    </CustomForm>
  );
}

export const createRatingButton = {
  label: 'Create',
  open: (user?: ExtUser) =>
    openModal({
      title: 'Create Rating',
      children: <CreateRatingModal data={user} />,
    }),
};

export const createRatingAction = {
  open: (user?: ExtUser) =>
    openModal({
      title: 'Create Rating',
      children: <CreateRatingModal data={user} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
