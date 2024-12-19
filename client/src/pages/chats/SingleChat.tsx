import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Container,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Textarea,
} from '@mantine/core';
import {
  useDocumentTitle,
  useElementSize,
  useScrollIntoView,
} from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconChevronLeft, IconRefresh, IconSend } from '@tabler/icons';
import { Reply } from '../../features/replies/reply.model';
import { useSelectSingleUserQuery } from '../../features/users/users.api';
import {
  useCreateMessageMutation,
  useSelectUserMessagesQuery,
} from '../../features/messages/messages.api';
import { CreateMessageDto } from '../../features/messages/message.dto';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import MessagesTimeline from '../../common/components/MessagesTimeline';
import ReplyAvatarWithClose from '../../common/components/ReplyAvatarWithClose';
import { editMessageAction } from '../../features/messages/EditMessageModal';
import { deleteMessageAction } from '../../features/messages/DeleteMessageModal';
import { MAX_TEXT_LENGTH } from '../../common/constants';

export default function SingleChat() {
  const [t] = useTranslation();

  const { nick } = useParams();

  useDocumentTitle(t('navbar.chat') + ' ' + nick);

  const { ref, height } = useElementSize();

  const { scrollIntoView, scrollableRef, targetRef } =
    useScrollIntoView<HTMLDivElement>();

  const form = useForm({
    initialValues: {
      userId: 0,
      messageId: 0,
      text: '',
    },
  });

  const { data: user } = useSelectSingleUserQuery(nick!);

  const response = useSelectUserMessagesQuery(user?.id || 0, { skip: !user });

  useEffect(() => {
    if (!response.isFetching) {
      scrollIntoView();
    }
  }, [response.isFetching]);

  const message = response.data?.find(
    (message) => message.id === form.values.messageId,
  );

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const handleSubmit = async (dto: CreateMessageDto) => {
    await createMessage({ ...dto, userId: user?.id || 0 });
    form.reset();
  };

  return (
    <Container ref={ref} h='100%' size='xs' px={0}>
      <Flex h={height} gap={8} direction='column'>
        <Paper p={8} radius={0}>
          <Group spacing={0} position='apart'>
            <ActionIcon size={24} component={Link} to='/chats/my'>
              <IconChevronLeft size={16} />
            </ActionIcon>
            {user && <AvatarWithSingleText {...user} />}
            <ActionIcon
              size={24}
              loading={response.isFetching}
              onClick={response.refetch}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
        </Paper>
        <Paper
          viewportRef={scrollableRef}
          component={ScrollArea}
          p={8}
          radius={0}
          style={{ flex: 1 }}
        >
          <MessagesTimeline
            {...response}
            actions={[editMessageAction, deleteMessageAction]}
            reply={(reply: Reply) => form.setFieldValue('messageId', reply.id)}
          />
          <div ref={targetRef}></div>
        </Paper>
        {message && (
          <ReplyAvatarWithClose
            {...message}
            close={() => form.setFieldValue('messageId', 0)}
          />
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Textarea
            placeholder={t('columns.text')}
            rightSection={
              <ActionIcon size={24} type='submit' disabled={isLoading}>
                <IconSend size={16} />
              </ActionIcon>
            }
            required
            autosize
            maxLength={MAX_TEXT_LENGTH}
            {...form.getInputProps('text')}
          />
        </form>
      </Flex>
    </Container>
  );
}
