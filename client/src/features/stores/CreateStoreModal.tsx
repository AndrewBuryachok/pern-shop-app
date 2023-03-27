import { Loader, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateStoreMutation } from './stores.api';
import { useSelectMyMarketsQuery } from '../markets/markets.api';
import { CreateStoreDto } from './store.dto';
import CustomForm from '../../common/components/CustomForm';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectMarkets } from '../../common/utils';

export default function CreateStoreModal() {
  const form = useForm({
    initialValues: {
      market: '',
      name: '',
    },
    transformValues: ({ market, ...rest }) => ({
      ...rest,
      marketId: +market,
    }),
  });

  const { data: markets, isFetching: isMarketsFetching } =
    useSelectMyMarketsQuery();

  const market = markets?.find((market) => market.id === +form.values.market);
  form.values.name = market ? `#${market.stores + 1}` : '';

  const [createStore, { isLoading }] = useCreateStoreMutation();

  const handleSubmit = async (dto: CreateStoreDto) => {
    await createStore(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create store'}
    >
      <Select
        label='Market'
        placeholder='Market'
        rightSection={isMarketsFetching && <Loader size={16} />}
        itemComponent={PlacesItem}
        data={selectMarkets(markets)}
        searchable
        required
        disabled={isMarketsFetching}
        {...form.getInputProps('market')}
      />
      <TextInput label='Name' disabled {...form.getInputProps('name')} />
    </CustomForm>
  );
}

export const createStoreButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Store',
      children: <CreateStoreModal />,
    }),
};
