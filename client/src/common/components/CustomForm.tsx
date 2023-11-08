import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LoadingOverlay, Stack, Text } from '@mantine/core';

type Props = {
  children: ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
  text?: string;
  isChanged?: boolean;
};

export default function CustomForm(props: Props) {
  const [t] = useTranslation();

  return (
    <form onSubmit={props.onSubmit}>
      <Stack spacing={8}>
        <LoadingOverlay visible={props.isLoading} />
        {props.children}
        {props.text && (
          <Text size='xs'>
            {props.text.charAt(0) + props.text.substring(1).toLowerCase()}?
          </Text>
        )}
        <Button type='submit' disabled={props.isLoading || props.isChanged}>
          {t('components.submit')}
        </Button>
      </Stack>
    </form>
  );
}
