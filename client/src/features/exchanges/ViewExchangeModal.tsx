import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Exchange>;

export default function ViewExchangeModal({ data: exchange }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={exchange.id} readOnly />
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...exchange.executorUser} />}
        iconWidth={48}
        value={exchange.executorUser.nick}
        readOnly
      />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...exchange.customerCard.user} />}
        iconWidth={48}
        value={parseCard(exchange.customerCard)}
        readOnly
      />
      <TextInput
        label={t('columns.type')}
        value={
          exchange.type ? t('constants.increase') : t('constants.decrease')
        }
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${exchange.sum} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(exchange.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewExchangeAction = {
  open: (exchange: Exchange) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.exchanges'),
      children: <ViewExchangeModal data={exchange} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
