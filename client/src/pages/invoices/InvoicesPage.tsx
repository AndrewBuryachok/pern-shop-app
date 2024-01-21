import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllInvoicesQuery,
  useGetMyInvoicesQuery,
  useGetReceivedInvoicesQuery,
} from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import {
  createMyInvoiceButton,
  createUserInvoiceButton,
} from '../../features/invoices/CreateInvoiceModal';
import {
  completeMyInvoiceAction,
  completeUserInvoiceAction,
} from '../../features/invoices/CompleteInvoiceModal';
import { deleteInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';

export default function InvoicesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    description: searchParams.get('description') || '',
    minSum: +(searchParams.get('minSum') || 0) || null,
    maxSum: +(searchParams.get('maxSum') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    my: useGetMyInvoicesQuery,
    received: useGetReceivedInvoicesQuery,
    all: useGetAllInvoicesQuery,
  }[tab]!({ page, search });

  const button = { my: createMyInvoiceButton, all: createUserInvoiceButton }[
    tab
  ];

  const actions = {
    my: [deleteInvoiceAction],
    received: [completeMyInvoiceAction],
    all: [completeUserInvoiceAction, deleteInvoiceAction],
  }[tab];

  return (
    <InvoicesTable
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
