import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { createMyInvoiceButton } from '../../features/invoices/CreateInvoiceModal';
import { completeMyInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { deleteMyInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';
import { Role } from '../../common/constants';

export default function MyInvoices() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.SENDER, Filter.RECEIVER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    description: '',
  });

  const response = useGetMyInvoicesQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.BANKER }];

  const button = createMyInvoiceButton;

  const actions = [completeMyInvoiceAction, deleteMyInvoiceAction];

  return (
    <InvoicesTable
      {...response}
      title='My Invoices'
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
