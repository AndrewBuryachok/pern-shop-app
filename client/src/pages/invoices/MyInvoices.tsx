import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { createMyInvoiceButton } from '../../features/invoices/CreateInvoiceModal';
import { completeMyInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { deleteMyInvoiceAction } from '../../features/invoices/DeleteInvoiceModal';
import { Role } from '../../common/constants';

export default function MyInvoices() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    description: '',
  });

  const response = useGetMyInvoicesQuery({ page, search });

  const links = [{ label: t('pages.all'), to: '../all', role: Role.BANKER }];

  const button = createMyInvoiceButton;

  const actions = [completeMyInvoiceAction, deleteMyInvoiceAction];

  return (
    <InvoicesTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.invoices')}
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
