import { Link } from 'react-router-dom';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';

export default function NotFound() {
  useDocumentTitle('Not Found | Shop');

  return (
    <Stack align='center'>
      <Title order={1} size={64}>
        404
      </Title>
      <Title order={3}>You have found a secret place.</Title>
      <Text color='dimmed'>
        You may have mistyped the address, or the page has been moved to another
        URL.
      </Text>
      <Button component={Link} to='/' variant='subtle'>
        Take me back to home page
      </Button>
    </Stack>
  );
}
