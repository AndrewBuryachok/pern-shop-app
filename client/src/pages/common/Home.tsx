import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import {
  IconAd,
  IconArchive,
  IconArticle,
  IconBasket,
  IconBoxModel,
  IconBuildingCircus,
  IconBuildingCottage,
  IconBuildingSkyscraper,
  IconBuildingStadium,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconBusinessplan,
  IconCashBanknote,
  IconChartBar,
  IconChecklist,
  IconCreditCard,
  IconExchange,
  IconFileDollar,
  IconFriends,
  IconMailbox,
  IconMap,
  IconMessages,
  IconNews,
  IconReportMoney,
  IconScript,
  IconShoppingBag,
  IconTir,
  IconTrolley,
  IconTruck,
  IconUsers,
} from '@tabler/icons';

export default function Home() {
  const [t] = useTranslation();

  useDocumentTitle(t('navbar.home'));

  const features = [
    {
      title: 'users',
      icon: IconUsers,
    },
    {
      title: 'friends',
      icon: IconFriends,
      sub: '/top',
    },
    {
      title: 'chats',
      icon: IconMessages,
      sub: '/my',
    },
    {
      title: 'reports',
      icon: IconNews,
    },
    {
      title: 'articles',
      icon: IconArticle,
    },
    {
      title: 'polls',
      icon: IconChartBar,
    },
    {
      title: 'cards',
      icon: IconCreditCard,
      sub: '/my',
    },
    {
      title: 'exchanges',
      icon: IconExchange,
      sub: '/my',
    },
    {
      title: 'payments',
      icon: IconCashBanknote,
      sub: '/my',
    },
    {
      title: 'invoices',
      icon: IconBusinessplan,
      sub: '/my',
    },
    {
      title: 'goods',
      icon: IconBasket,
    },
    {
      title: 'purchases',
      icon: IconShoppingBag,
      sub: '/my',
    },
    {
      title: 'deliveries',
      icon: IconTruck,
    },
    {
      title: 'orders',
      icon: IconTrolley,
    },
    {
      title: 'haulages',
      icon: IconTir,
    },
    {
      title: 'map',
      icon: IconMap,
    },
    {
      title: 'towns',
      icon: IconBuildingSkyscraper,
    },
    {
      title: 'farms',
      icon: IconBuildingCottage,
    },
    {
      title: 'shops',
      icon: IconBuildingStore,
    },
    {
      title: 'markets',
      icon: IconBuildingStadium,
    },
    {
      title: 'storages',
      icon: IconBuildingWarehouse,
    },
    {
      title: 'stations',
      icon: IconMailbox,
    },
    {
      title: 'stalls',
      icon: IconBuildingCircus,
    },
    {
      title: 'cells',
      icon: IconBoxModel,
    },
    {
      title: 'boxes',
      icon: IconArchive,
    },
    {
      title: 'rents',
      icon: IconFileDollar,
    },
    {
      title: 'leases',
      icon: IconReportMoney,
    },
    {
      title: 'hires',
      icon: IconScript,
    },
    {
      title: 'adverts',
      icon: IconAd,
    },
    {
      title: 'tasks',
      icon: IconChecklist,
    },
  ];

  return (
    <Stack align='center'>
      <Title order={1}>{t('home.title')}</Title>
      <SimpleGrid
        cols={6}
        spacing={8}
        breakpoints={[
          { maxWidth: 'xl', cols: 5 },
          { maxWidth: 'lg', cols: 4 },
          { maxWidth: 'md', cols: 3 },
          { maxWidth: 'sm', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {features.map((feature) => (
          <Paper key={feature.title} p='md'>
            <Stack spacing={0}>
              <ThemeIcon size={48}>
                <feature.icon size={32} />
              </ThemeIcon>
              <Text size='lg' weight='bold'>
                {t(`navbar.${feature.title}`)}
              </Text>
              <Text size='sm' color='dimmed'>
                {t('home.text')}
                <Anchor
                  component={Link}
                  to={`/${feature.title}${feature.sub || ''}`}
                >
                  {t('home.anchor')}
                </Anchor>
              </Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
