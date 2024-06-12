import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Group, Paper, Select, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import { useGetMyMessagesQuery } from '../../features/messages/messages.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import CustomAvatar from '../../common/components/CustomAvatar';
import SingleText from '../../common/components/SingleText';
import CustomHighlight from '../../common/components/CustomHighlight';
import { parseTime, selectUsers } from '../../common/utils';

export default function ChatsList() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      user: '',
    },
  });

  useEffect(() => {
    if (form.values.user) {
      navigate(`/chats/${form.values.user}`);
    }
  }, [form.values.user]);

  const user = getCurrentUser()!;

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const { data: chats } = useGetMyMessagesQuery();

  return (
    <Container size='xs' px={0}>
      <Stack spacing={8}>
        <Title order={3}>{t('navbar.chats')}</Title>
        <Select
          placeholder={t('columns.user')}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users).map((user) => ({
            ...user,
            value: user.nick,
          }))}
          limit={20}
          searchable
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
        {chats
          ?.map((chat) => ({
            ...chat,
            user: chat.user.id === user.id ? chat.chat : chat.user,
          }))
          .map((chat) => (
            <Paper
              key={chat.id}
              p={8}
              component={Link}
              to={`/chats/${chat.user.nick}`}
            >
              <Group spacing={8} align='flex-start' noWrap>
                <CustomAvatar {...chat.user} />
                <div>
                  <SingleText text={chat.user.nick} bold />
                  <CustomHighlight text={chat.text} />
                  <SingleText text={parseTime(chat.createdAt)} dimmed />
                </div>
              </Group>
            </Paper>
          ))}
      </Stack>
    </Container>
  );
}
