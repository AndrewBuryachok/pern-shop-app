import { useTranslation } from 'react-i18next';
import { Aside, ScrollArea, Skeleton, Stack, Title } from '@mantine/core';
import {
  useSelectAllUsersQuery,
  useSelectTwitchUsersQuery,
} from '../../features/users/users.api';
import { getOnlineUsers } from '../../features/mqtt/mqtt.slice';
import CustomStream from './CustomStream';
import AvatarWithSingleText from './AvatarWithSingleText';

type Props = {
  opened: boolean;
};

export default function CustomAside(props: Props) {
  const [t] = useTranslation();

  const { data: streamers, isLoading: isStreamersLoading } =
    useSelectTwitchUsersQuery();

  const { data: users, isLoading: isUsersLoading } = useSelectAllUsersQuery();

  const online = getOnlineUsers();

  const onlineUsers = users?.filter((user) => online.includes(user.id));

  const offlineUsers = users?.filter((user) => !online.includes(user.id));

  return (
    <>
      {props.opened && (
        <Aside
          p='md'
          hiddenBreakpoint='sm'
          hidden={!props.opened}
          width={{ sm: 200 }}
          withBorder={false}
        >
          <Aside.Section component={ScrollArea} grow>
            <Stack spacing={8}>
              {(!!streamers?.length || isStreamersLoading) && (
                <Title order={5}>
                  {t('aside.live')} - {streamers?.length || 0}
                </Title>
              )}
              {isStreamersLoading &&
                [...Array(5).keys()].map((key) => (
                  <Skeleton key={key} height={32} />
                ))}
              {streamers?.map((user) => (
                <CustomStream key={user.id} {...user} />
              ))}
              {(!!onlineUsers?.length || isUsersLoading) && (
                <Title order={5}>
                  {t('aside.online')} - {onlineUsers?.length || 0}
                </Title>
              )}
              {isUsersLoading &&
                [...Array(5).keys()].map((key) => (
                  <Skeleton key={key} height={32} />
                ))}
              {onlineUsers?.map((user) => (
                <AvatarWithSingleText key={user.id} {...user} />
              ))}
              {(!!offlineUsers?.length || isUsersLoading) && (
                <Title order={5}>
                  {t('aside.offline')} - {offlineUsers?.length || 0}
                </Title>
              )}
              {isUsersLoading &&
                [...Array(5).keys()].map((key) => (
                  <Skeleton key={key} height={32} />
                ))}
              {offlineUsers?.map((user) => (
                <AvatarWithSingleText key={user.id} {...user} />
              ))}
            </Stack>
          </Aside.Section>
        </Aside>
      )}
    </>
  );
}
