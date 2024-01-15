import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyPollMutation,
  useCreateUserPollMutation,
} from './polls.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreatePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { UsersItem } from '../../common/components/UsersItem';
import { selectMarks, selectUsers } from '../../common/utils';
import { MAX_LINK_LENGTH, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreatePollModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      text: '',
      mark: '',
      image: '',
      video: '',
    },
    transformValues: ({ user, mark, ...rest }) => ({
      ...rest,
      mark: +mark,
      userId: +user,
    }),
  });

  const [image] = useDebouncedValue(form.values.image, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createPoll, { isLoading }] = hasRole
    ? useCreateUserPollMutation()
    : useCreateMyPollMutation();

  const handleSubmit = async (dto: ExtCreatePollDto) => {
    await createPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.polls')}
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
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Select
        label={t('columns.mark')}
        placeholder={t('columns.mark')}
        data={selectMarks()}
        searchable
        required
        {...form.getInputProps('mark')}
      />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        description={t('information.video')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      <CustomVideo video={video} />
    </CustomForm>
  );
}

export const createPollFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.polls'),
      children: <CreatePollModal hasRole={hasRole} />,
    }),
});

export const createMyPollButton = createPollFactory(false);

export const createUserPollButton = createPollFactory(true);
