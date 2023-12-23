import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import {
  IconArticle,
  IconBasket,
  IconBoxModel,
  IconBuildingCircus,
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
  IconGardenCart,
  IconGavel,
  IconMail,
  IconMap,
  IconPaperBag,
  IconReportMoney,
  IconScale,
  IconShoppingBag,
  IconShoppingCart,
  IconStar,
  IconTags,
  IconTrolley,
  IconTruck,
  IconUsers,
} from '@tabler/icons';

export default function Home() {
  const [t] = useTranslation();

  useDocumentTitle(t('navbar.home'));

  const theme = useMantineTheme();

  const features = [
    {
      title: 'users',
      icon: IconUsers,
    },
    {
      title: 'cards',
      icon: IconCreditCard,
      my: true,
    },
    {
      title: 'payments',
      icon: IconCashBanknote,
      my: true,
    },
    {
      title: 'exchanges',
      icon: IconExchange,
      my: true,
    },
    {
      title: 'invoices',
      icon: IconBusinessplan,
      my: true,
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
      title: 'lots',
      icon: IconGavel,
    },
    {
      title: 'trades',
      icon: IconPaperBag,
      my: true,
    },
    {
      title: 'sales',
      icon: IconGardenCart,
      my: true,
    },
    {
      title: 'bids',
      icon: IconTags,
      my: true,
    },
    {
      title: 'orders',
      icon: IconTrolley,
    },
    {
      title: 'deliveries',
      icon: IconTruck,
    },
    {
      title: 'map',
      icon: IconMap,
    },
    {
      title: 'cities',
      icon: IconBuildingSkyscraper,
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
      title: 'stores',
      icon: IconBuildingCircus,
    },
    {
      title: 'cells',
      icon: IconBoxModel,
    },
    {
      title: 'rents',
      icon: IconFileDollar,
      my: true,
    },
    {
      title: 'leases',
      icon: IconReportMoney,
      my: true,
    },
    {
      title: 'polls',
      icon: IconChartBar,
    },
    {
      title: 'friends',
      icon: IconFriends,
      my: true,
    },
    {
      title: 'followings',
      icon: IconMail,
      my: true,
    },
    {
      title: 'ratings',
      icon: IconStar,
      my: true,
    },
    {
      title: 'tasks',
      icon: IconChecklist,
    },
    {
      title: 'plaints',
      icon: IconScale,
    },
    {
      title: 'articles',
      icon: IconArticle,
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
          <Paper key={feature.title} p='md' withBorder>
            <Stack spacing={0}>
              <feature.icon size={48} color={theme.fn.primaryColor()} />
              <Text size='lg' weight='bold'>
                {t('navbar.' + feature.title)}
              </Text>
              <Text size='sm' color='dimmed'>
                {t('home.text')}
                <Anchor
                  component={Link}
                  to={`/${feature.title}${feature.my ? '/my' : ''}`}
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
