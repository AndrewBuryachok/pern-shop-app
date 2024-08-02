import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import { useDeleteExchangeMutation } from './exchanges.api';
import { DeleteExchangeDto } from './exchange.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Exchange>;

export default function DeleteExchangeModal({ data: exchange }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      exchangeId: exchange.id,
    },
  });

  const [deleteExchange, { isLoading }] = useDeleteExchangeMutation();

  const handleSubmit = async (dto: DeleteExchangeDto) => {
    await deleteExchange(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.exchanges')}
    >
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
    </CustomForm>
  );
}

export const deleteExchangeAction = {
  open: (exchange: Exchange) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.exchanges'),
      children: <DeleteExchangeModal data={exchange} />,
    }),
  disable: () => false,
  color: Color.RED,
};
