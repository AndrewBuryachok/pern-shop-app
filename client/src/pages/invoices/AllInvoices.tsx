import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { createUserInvoiceButton } from '../../features/invoices/CreateInvoiceModal';
import { completeUserInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { deleteUserInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';

export default function AllInvoices() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    description: '',
  });

  const response = useGetAllInvoicesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  const button = createUserInvoiceButton;

  const actions = [completeUserInvoiceAction, deleteUserInvoiceAction];

  return (
    <InvoicesTable
      {...response}
      title='All Invoices'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
