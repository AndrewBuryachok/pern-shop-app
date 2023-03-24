import {
  Button,
  Checkbox,
  Group,
  Menu,
  Select,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconRefresh, IconSearch } from '@tabler/icons';
import { IHead, ISearch } from '../interfaces';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import CustomForm from './CustomForm';
import CustomAvatar from './CustomAvatar';
import { UsersItem } from './UsersItem';
import ThingImage from './ThingImage';
import { ThingsItem } from './ThingItem';
import { selectCategories, selectItems, selectUsers } from '../utils';

type Props = IHead;

export default function CustomHead(props: Props) {
  useDocumentTitle(`${props.title} | Shop`);

  const form = useForm({
    initialValues: {
      user: '',
      filters:
        props.search.filters
          ?.filter((filter) => filter.value)
          .map((filter) => filter.label.toLowerCase()) || [],
      name: props.search.name,
      category: '',
      item: props.search.item,
      description: props.search.description,
      type: props.search.type,
    },
    transformValues: ({ user, filters, category, item, type, ...other }) => ({
      ...other,
      user: user === null ? '' : user,
      filters: props.search.filters?.map((filter) => ({
        ...filter,
        value: filters.includes(filter.label.toLowerCase()),
      })),
      item: item === null ? '' : item,
      type: type === null ? '' : type,
    }),
  });

  const { data: users } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user!);

  const handleSubmit = (search: ISearch) => {
    props.setSearch(search);
  };

  return (
    <Group position='apart' spacing={8}>
      <Title order={3}>{props.title}</Title>
      <Button
        leftIcon={<IconRefresh size={16} />}
        loading={props.isFetching}
        onClick={props.refetch}
        compact
      >
        Refresh
      </Button>
      <Menu offset={4} position='bottom-end'>
        <Menu.Target>
          <Button leftIcon={<IconSearch size={16} />} compact>
            Search
          </Button>
        </Menu.Target>
        <Menu.Dropdown p='md'>
          <CustomForm
            onSubmit={form.onSubmit(handleSubmit)}
            isLoading={props.isFetching}
          >
            <Select
              label='User'
              placeholder='User'
              icon={user && <CustomAvatar {...user} />}
              iconWidth={48}
              itemComponent={UsersItem}
              data={selectUsers(users)}
              searchable
              allowDeselect
              {...form.getInputProps('user')}
            />
            {props.search.filters && (
              <Checkbox.Group
                label='Filters'
                {...form.getInputProps('filters')}
              >
                {props.search.filters.map((filter) => (
                  <Checkbox
                    key={filter.label}
                    label={filter.label}
                    value={filter.label.toLowerCase()}
                  />
                ))}
              </Checkbox.Group>
            )}
            {(props.search.name || props.search.name === '') && (
              <TextInput
                label='Name'
                placeholder='Name'
                {...form.getInputProps('name')}
              />
            )}
            {(props.search.item || props.search.item === '') && (
              <>
                <Select
                  label='Category'
                  placeholder='Category'
                  data={selectCategories()}
                  searchable
                  allowDeselect
                  {...form.getInputProps('category')}
                />
                <Select
                  label='Item'
                  placeholder='Item'
                  icon={
                    !!form.values.item && (
                      <ThingImage item={+form.values.item} />
                    )
                  }
                  iconWidth={48}
                  itemComponent={ThingsItem}
                  data={selectItems(form.values.category)}
                  searchable
                  allowDeselect
                  {...form.getInputProps('item')}
                />
              </>
            )}
            {(props.search.description || props.search.description === '') && (
              <Textarea
                label='Description'
                placeholder='Description'
                {...form.getInputProps('description')}
              />
            )}
            {(!!props.search.type || props.search.type === '') && (
              <Select
                label='Type'
                placeholder='Type'
                data={[
                  { label: 'Negative', value: '-1' },
                  { label: 'Positive', value: '1' },
                ]}
                searchable
                allowDeselect
                {...form.getInputProps('type')}
              />
            )}
          </CustomForm>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
