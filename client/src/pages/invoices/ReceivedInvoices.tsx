import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetReceivedInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';
import { completeMyInvoiceAction } from '../../features/invoices/CompleteInvoiceModal';
import { Role } from '../../common/constants';

export default function ReceivedInvoices() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    description: searchParams.get('description') || '',
  });

  const response = useGetReceivedInvoicesQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.all'), to: '../all', role: Role.BANKER },
  ];

  const actions = [completeMyInvoiceAction];

  return (
    <InvoicesTable
      {...response}
      title={t('pages.received') + ' ' + t('navbar.invoices')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
