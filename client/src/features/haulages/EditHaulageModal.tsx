import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import { useEditHaulageMutation } from './haulages.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditHaulageDto } from './haulage.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingsItem';
import {
  selectCardsWithBalance,
  selectItems,
  selectKits,
} from '../../common/utils';
import {
  Color,
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
  Status,
} from '../../common/constants';

type Props = IModal<Haulage> & { hasRole: boolean };

export default function EditHaulageModal({ data: haulage, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      haulageId: haulage.id,
      item: `${haulage.item}`,
      description: haulage.description,
      amount: haulage.amount,
      intake: haulage.intake,
      kit: `${haulage.kit}`,
      price: haulage.price,
      card: `${haulage.fromHire.card.id}`,
    },
    transformValues: ({ kit, card, ...rest }) => ({ ...rest, kit: +kit }),
    validate: {
      card: (_, values) =>
        haulage.price < values.price &&
        myCard.balance < values.price - haulage.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(haulage.fromHire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.account.balance || 0;

  const [editHaulage, { isLoading }] = useEditHaulageMutation();

  const handleSubmit = async (dto: EditHaulageDto) => {
    await editHaulage(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.haulages')}
      isChanged={!form.isDirty()}
    >
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems()}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label={t('columns.intake')}
        placeholder={t('columns.intake')}
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label={t('columns.kit')}
        placeholder={t('columns.kit')}
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
      <Select
        label={t('columns.card')}
        description={`${
          haulage.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(haulage.price - form.values.price)} ${t(
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

export const editHaulageFactory = (hasRole: boolean) => ({
  open: (haulage: Haulage) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.haulages'),
      children: <EditHaulageModal data={haulage} hasRole={hasRole} />,
    }),
  disable: (haulage: Haulage) => haulage.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyHaulageAction = editHaulageFactory(false);

export const editUserHaulageAction = editHaulageFactory(true);
