import { ReactNode } from 'react';
import { Button, LoadingOverlay, Stack, Text } from '@mantine/core';

type Props = {
  children: ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
  text?: string;
};

export default function CustomForm(props: Props) {
  return (
    <form onSubmit={props.onSubmit}>
      <Stack spacing={8}>
        <LoadingOverlay visible={props.isLoading} />
        {props.children}
        {props.text && <Text size='xs'>{props.text}?</Text>}
        <Button type='submit'>Submit</Button>
      </Stack>
    </form>
  );
}
