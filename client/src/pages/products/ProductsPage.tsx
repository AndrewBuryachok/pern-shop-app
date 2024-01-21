import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllProductsQuery,
  useGetMainProductsQuery,
  useGetMyProductsQuery,
  useGetPlacedProductsQuery,
} from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import {
  createMyProductButton,
  createUserProductButton,
} from '../../features/products/CreateProductModal';
import { editProductAction } from '../../features/products/EditProductModal';
import {
  buyMyProductAction,
  buyUserProductAction,
} from '../../features/products/BuyProductModal';
import { completeProductAction } from '../../features/products/CompleteProductModal';

export default function ProductsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainProductsQuery,
    my: useGetMyProductsQuery,
    placed: useGetPlacedProductsQuery,
    all: useGetAllProductsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyProductButton,
    my: createMyProductButton,
    all: createUserProductButton,
  }[tab];

  const actions = {
    main: [buyMyProductAction],
    my: [editProductAction, completeProductAction],
    all: [editProductAction, buyUserProductAction, completeProductAction],
  }[tab];

  return (
    <ProductsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
