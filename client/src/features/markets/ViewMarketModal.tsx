import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Market>;

export default function ViewMarketModal({ data: market }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={market.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...market.card.user} />}
        iconWidth={48}
        value={parseCard(market.card)}
        readOnly
      />
      <TextInput label={t('columns.market')} value={market.name} readOnly />
      {market.image && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={market.image} />
        </Input.Wrapper>
      )}
      {market.video && (
        <Input.Wrapper label={t('columns.video')}>
          <CustomVideo video={market.video} />
        </Input.Wrapper>
      )}
      <Textarea
        label={t('columns.description')}
        value={market.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={market.x} readOnly />
      <TextInput label={t('columns.y')} value={market.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(market.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewMarketAction = {
  open: (market: Market) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.markets'),
      children: <ViewMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
