import { useTranslation } from 'react-i18next';
import { Button, Group, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconRefresh, IconSearch } from '@tabler/icons';
import { IHead } from '../interfaces';
import { openSearchModal } from './SearchModal';

type Props = IHead;

export default function CustomHead(props: Props) {
  const [t] = useTranslation();

  useDocumentTitle(props.title);

  return (
    <Group position='apart' spacing={8}>
      <Title order={3}>{props.title}</Title>
      <Button
        leftIcon={<IconRefresh size={16} />}
        loading={props.isFetching}
        onClick={props.refetch}
        compact
      >
        {t('components.refresh')}
      </Button>
      <Button
        leftIcon={<IconSearch size={16} />}
        onClick={() => openSearchModal(props)}
        compact
      >
        {t('components.search')}
      </Button>
    </Group>
  );
}
