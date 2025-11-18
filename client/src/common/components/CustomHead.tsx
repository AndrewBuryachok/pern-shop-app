import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, Group, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconRefresh, IconSearch } from '@tabler/icons';
import { IHead } from '../interfaces';
import { openSearchModal } from './SearchModal';

type Props = IHead;

export default function CustomHead(props: Props) {
  const [t] = useTranslation();

  const active = useLocation().pathname.split('/');

  const page = t(`navbar.${active[1]}`);

  const tab = t(`pages.${active[2] || 'main'}`);

  useDocumentTitle(tab + ' ' + page);

  return (
    <Group spacing={0} position='apart'>
      <Title order={3}>{page}</Title>
      <Group spacing={8}>
        <Button
          loading={props.isFetching}
          loaderPosition='center'
          onClick={props.refetch}
          compact
        >
          <IconRefresh size={16} />
        </Button>
        <Button
          loading={props.isFetching}
          loaderPosition='center'
          onClick={() => openSearchModal(props)}
          compact
        >
          <IconSearch size={16} />
        </Button>
      </Group>
    </Group>
  );
}
