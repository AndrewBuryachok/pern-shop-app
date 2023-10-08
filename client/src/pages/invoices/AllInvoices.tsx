import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { createUserInvoiceButton } from '../../features/invoices/CreateInvoiceModal';
import { completeUserInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { deleteUserInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';

export default function AllInvoices() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: null,
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
