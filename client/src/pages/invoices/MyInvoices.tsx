import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { createInvoiceButton } from '../../features/invoices/CreateInvoiceModal';
import { completeInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { deleteInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyInvoices() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyInvoicesQuery({ page, search: debounced });

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
