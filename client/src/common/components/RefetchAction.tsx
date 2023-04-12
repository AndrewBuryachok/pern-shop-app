import { ActionIcon } from '@mantine/core';
import { IconRefresh } from '@tabler/icons';

type Props = {
  isFetching: boolean;
  refetch: () => void;
  skip?: boolean;
};

export default function RefetchAction(props: Props) {
  return (
    <ActionIcon
      size={24}
      loading={props.isFetching}
      onClick={props.refetch}
      disabled={props.skip}
    >
      <IconRefresh size={16} />
    </ActionIcon>
  );
}
