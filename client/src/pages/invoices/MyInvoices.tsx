import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { createInvoiceButton } from '../../features/invoices/CreateInvoiceModal';
import { completeInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { deleteInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';
import { isUserNotHasRole } from '../../common/utils';
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

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.BANKER) },
  ];

  const button = createInvoiceButton;

  const actions = [completeInvoiceAction, deleteInvoiceAction];

  return (
    <InvoicesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
      title='My Invoices'
    />
  );
}
