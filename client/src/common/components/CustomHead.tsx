import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, Group, ThemeIcon, Title, Tooltip } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconInfoCircle, IconRefresh, IconSearch } from '@tabler/icons';
import { IHead } from '../interfaces';
import { openSearchModal } from './SearchModal';

type Props = IHead;

export default function CustomHead(props: Props) {
  const [t] = useTranslation();

  const active = useLocation().pathname.split('/');

  const page = t('navbar.' + active[1]);

  useDocumentTitle(t('pages.' + (active[2] || 'main')) + ' ' + page);

  return (
    <Group spacing={0} position='apart'>
      <Group spacing={4}>
        <Title order={3}>{page}</Title>
        <Tooltip
          label={t('information.' + active[1])}
          position='right'
          width={220}
          multiline
          withArrow
        >
          <ThemeIcon size={20}>
            <IconInfoCircle size={16} />
          </ThemeIcon>
        </Tooltip>
      </Group>
      <Button
        leftIcon={<IconRefresh size={16} />}
        loading={props.isFetching}
        loaderPosition='center'
        onClick={props.refetch}
        compact
      >
        {t('components.refresh')}
      </Button>
      <Button
        leftIcon={<IconSearch size={16} />}
        loading={props.isFetching}
        loaderPosition='center'
        onClick={() => openSearchModal(props)}
        compact
      >
        {t('components.search')}
      </Button>
    </Group>
  );
}
