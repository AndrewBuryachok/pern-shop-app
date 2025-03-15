import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Hire } from './hire.model';
import { useContinueHireMutation } from './hires.api';
import { useSelectBoxStationQuery } from '../boxes/boxes.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { HireIdDto } from './hire.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import {
  parseBox,
  parseCard,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Hire> & { hasRole: boolean };

export default function ContinueHireModal({ data: hire, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const { data: station, ...stationResponse } = useSelectBoxStationQuery(
    hire.box.id,
  );

  const form = useForm({
    initialValues: {
      hireId: hire.id,
      card: `${hire.card.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: () =>
        !station || myCard.balance < station.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(hire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.account.balance || 0;

  const [continueHire, { isLoading }] = useContinueHireMutation();

  const handleSubmit = async (dto: HireIdDto) => {
    await continueHire(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.continue') + ' ' + t('modals.hires')}
    >
      <TextInput
        label={t('columns.tenant')}
        icon={<CustomAvatar {...hire.card.user} />}
        iconWidth={48}
        value={parseCard(hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...hire.box.station.card.user} />}
        iconWidth={48}
        value={parseCard(hire.box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parseBox(hire.box)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${station?.price || '-'} ${t('constants.currency')}`}
        rightSection={<RefetchAction {...stationResponse} />}
        readOnly
      />
      <Select
        label={t('columns.card')}
        description={`${t('information.decrease')} ${station?.price || 0} ${t(
          'constants.currency',
        )}`}
        rightSection={<RefetchAction {...cardsResponse} />}
        data={selectCardsWithBalance(cards)}
        readOnly
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const continueHireFactory = (hasRole: boolean) => ({
  open: (hire: Hire) =>
    openModal({
      title: t('actions.continue') + ' ' + t('modals.hires'),
      children: <ContinueHireModal data={hire} hasRole={hasRole} />,
    }),
  disable: (hire: Hire) => new Date(hire.completedAt) < new Date(),
  color: Color.GREEN,
});

export const continueMyHireAction = continueHireFactory(false);

export const continueUserHireAction = continueHireFactory(true);
