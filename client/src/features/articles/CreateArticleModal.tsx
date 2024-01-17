import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useCreateMyArticleMutation,
  useCreateUserArticleMutation,
} from './articles.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreateArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { MAX_IMAGE_LENGTH, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateArticleModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      text: '',
      image1: '',
      image2: '',
      image3: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [image1] = useDebouncedValue(form.values.image1, 500);
  const [image2] = useDebouncedValue(form.values.image2, 500);
  const [image3] = useDebouncedValue(form.values.image3, 500);

  const [createArticle, { isLoading }] = hasRole
    ? useCreateUserArticleMutation()
    : useCreateMyArticleMutation();

  const handleSubmit = async (dto: ExtCreateArticleDto) => {
    await createArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.articles')}
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
          disabled={usersResponse.isFetching}
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
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image1')}
      />
      <CustomImage image={image1} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image2')}
      />
      <CustomImage image={image2} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image3')}
      />
      <CustomImage image={image3} />
    </CustomForm>
  );
}

export const createArticleFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.articles'),
      children: <CreateArticleModal hasRole={hasRole} />,
    }),
});

export const createMyArticleButton = createArticleFactory(false);

export const createUserArticleButton = createArticleFactory(true);
