import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
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
    filters: [Filter.SENDER, Filter.RECEIVER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
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
