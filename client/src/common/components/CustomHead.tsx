import { Autocomplete, Group, Loader, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import { IHead } from '../interfaces';
import { useSelectAllUsersQuery } from '../../features/users/users.api';

type Props = IHead;

export default function CustomHead(props: Props) {
  useDocumentTitle(`${props.title} | Shop`);

  const { data: users, isLoading } = useSelectAllUsersQuery();

  return (
    <Group position='apart' spacing={8}>
      <Title order={3}>{props.title}</Title>
      <Autocomplete
        aria-label='Search'
        placeholder='Search'
        icon={isLoading ? <Loader size={16} /> : <IconSearch size={16} />}
        value={props.search}
        onChange={props.setSearch}
        data={users?.map((user) => user.name) || []}
      />
    </Group>
  );
}
