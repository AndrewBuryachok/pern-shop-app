import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';

export default function NotFound() {
  const [t] = useTranslation();

  useDocumentTitle(t('navbar.notfound'));

  return (
    <Stack align='center'>
      <Title order={1} size={64}>
        404
      </Title>
      <Title order={3}>{t('notfound.title')}</Title>
      <Text color='dimmed'>{t('notfound.text')}</Text>
      <Button component={Link} to='/' variant='subtle'>
        {t('notfound.button')}
      </Button>
    </Stack>
  );
}
