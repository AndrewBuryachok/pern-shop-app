import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Bargain } from './bargain.model';
import { useRateBargainMutation } from './bargains.api';
import { RateBargainDto } from './bargain.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseBargainAmount, parseCard, parseItem } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Bargain>;

export default function RateBargainModal({ data: bargain }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      bargainId: bargain.id,
      rate: 5,
    },
  });

  const [rateBargain, { isLoading }] = useRateBargainMutation();

  const handleSubmit = async (dto: RateBargainDto) => {
    await rateBargain(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.bargains')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...bargain.good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(bargain.good.shop.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...bargain.good} />}
        iconWidth={48}
        value={parseItem(bargain.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={bargain.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseBargainAmount(bargain)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${bargain.amount * bargain.good.price} ${t(
          'constants.currency',
        )}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateBargainAction = {
  open: (bargain: Bargain) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.bargains'),
      children: <RateBargainModal data={bargain} />,
    }),
  disable: (bargain: Bargain) => !!bargain.rate,
  color: Color.YELLOW,
};
