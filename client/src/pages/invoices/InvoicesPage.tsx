import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllInvoicesQuery,
  useGetMyInvoicesQuery,
} from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import {
  createMyInvoiceButton,
  createUserInvoiceButton,
} from '../../features/invoices/CreateInvoiceModal';
import {
  editMyInvoiceAction,
  editUserInvoiceAction,
} from '../../features/invoices/EditInvoiceModal';
import {
  completeMyInvoiceAction,
  completeUserInvoiceAction,
} from '../../features/invoices/CompleteInvoiceModal';
import {
  deleteMyInvoiceAction,
  deleteUserInvoiceAction,
} from '../../features/invoices/DeleteInvoiceModal';

export default function InvoicesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
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
    completed: searchParams.get('completed'),
  };

  const response = {
    my: useGetMyInvoicesQuery,
    all: useGetAllInvoicesQuery,
  }[tab]!(search);

  const button = { my: createMyInvoiceButton, all: createUserInvoiceButton }[
    tab
  ];

  const actions = {
    my: [editMyInvoiceAction, completeMyInvoiceAction, deleteMyInvoiceAction],
    all: [
      editUserInvoiceAction,
      completeUserInvoiceAction,
      deleteUserInvoiceAction,
    ],
  }[tab];

  return (
    <InvoicesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
