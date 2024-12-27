import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllGoodsQuery,
  useGetMainGoodsQuery,
  useGetMyGoodsQuery,
  useGetPlacedGoodsQuery,
} from '../../features/goods/goods.api';
import GoodsTable from '../../features/goods/GoodsTable';
import {
  createMyGoodButton,
  createUserGoodButton,
} from '../../features/goods/CreateGoodModal';
import { editGoodAction } from '../../features/goods/EditGoodModal';
import {
  buyMyGoodAction,
  buyUserGoodAction,
} from '../../features/goods/BuyGoodModal';
import { completeGoodAction } from '../../features/goods/CompleteGoodModal';

export default function GoodsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    shop: searchParams.get('shop'),
    market: searchParams.get('market'),
    stall: searchParams.get('stall'),
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
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainGoodsQuery,
    my: useGetMyGoodsQuery,
    placed: useGetPlacedGoodsQuery,
    all: useGetAllGoodsQuery,
  }[tab]!(search);

  const button = {
    main: createMyGoodButton,
    my: createMyGoodButton,
    all: createUserGoodButton,
  }[tab];

  const actions = {
    main: [buyMyGoodAction],
    my: [editGoodAction, completeGoodAction],
    all: [editGoodAction, buyUserGoodAction, completeGoodAction],
  }[tab];

  return (
    <GoodsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
