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
  IconCreditCard,
  IconExchange,
  IconFileDollar,
  IconFriends,
  IconGardenCart,
  IconMail,
  IconMailbox,
  IconMap,
  IconNews,
  IconPaperBag,
  IconReportMoney,
  IconScript,
  IconShoppingBag,
  IconShoppingCart,
  IconStar,
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
      title: 'subscribers',
      icon: IconMail,
      sub: '/top',
    },
    {
      title: 'chats',
      icon: IconMailbox,
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
      title: 'payments',
      icon: IconCashBanknote,
      sub: '/my',
    },
    {
      title: 'exchanges',
      icon: IconExchange,
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
      title: 'wares',
      icon: IconShoppingBag,
    },
    {
      title: 'products',
      icon: IconShoppingCart,
    },
    {
      title: 'trades',
      icon: IconPaperBag,
      sub: '/my',
    },
    {
      title: 'sales',
      icon: IconGardenCart,
      sub: '/my',
    },
    {
      title: 'orders',
      icon: IconTrolley,
    },
    {
      title: 'haulages',
      icon: IconTruck,
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
      title: 'stores',
      icon: IconBuildingCircus,
    },
    {
      title: 'cells',
      icon: IconBoxModel,
    },
    {
      title: 'drawers',
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
      title: 'ratings',
      icon: IconStar,
      sub: '/top',
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
