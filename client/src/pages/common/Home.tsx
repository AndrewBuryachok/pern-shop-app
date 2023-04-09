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
  IconCreditCard,
  IconExchange,
  IconFileDollar,
  IconGardenCart,
  IconMap,
  IconNotes,
  IconPaperBag,
  IconReportMoney,
  IconShoppingBag,
  IconShoppingCart,
  IconTrolley,
  IconTruck,
} from '@tabler/icons';

export default function Home() {
  useDocumentTitle('Home | Shop');

  const theme = useMantineTheme();

  const features = [
    {
      title: 'Cards',
      icon: IconCreditCard,
      my: true,
    },
    {
      title: 'Payments',
      icon: IconCashBanknote,
      my: true,
    },
    {
      title: 'Exchanges',
      icon: IconExchange,
      my: true,
    },
    {
      title: 'Invoices',
      icon: IconBusinessplan,
      my: true,
    },
    {
      title: 'Goods',
      icon: IconBasket,
    },
    {
      title: 'Wares',
      icon: IconShoppingBag,
    },
    {
      title: 'Products',
      icon: IconShoppingCart,
    },
    {
      title: 'Trades',
      icon: IconPaperBag,
      my: true,
    },
    {
      title: 'Sales',
      icon: IconGardenCart,
      my: true,
    },
    {
      title: 'Orders',
      icon: IconTrolley,
    },
    {
      title: 'Deliveries',
      icon: IconTruck,
    },
    {
      title: 'Map',
      icon: IconMap,
    },
    {
      title: 'Cities',
      icon: IconBuildingSkyscraper,
    },
    {
      title: 'Shops',
      icon: IconBuildingStore,
    },
    {
      title: 'Markets',
      icon: IconBuildingStadium,
    },
    {
      title: 'Storages',
      icon: IconBuildingWarehouse,
    },
    {
      title: 'Stores',
      icon: IconBuildingCircus,
    },
    {
      title: 'Cells',
      icon: IconBoxModel,
    },
    {
      title: 'Rents',
      icon: IconFileDollar,
      my: true,
    },
    {
      title: 'Leases',
      icon: IconReportMoney,
      my: true,
    },
    {
      title: 'Polls',
      icon: IconChartBar,
    },
    {
      title: 'Votes',
      icon: IconNotes,
      my: true,
    },
  ];

  return (
    <Stack align='center'>
      <Title order={1}>Online shop app</Title>
      <SimpleGrid
        cols={5}
        breakpoints={[
          { maxWidth: 'xl', cols: 4 },
          { maxWidth: 'lg', cols: 3 },
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {features.map((feature) => (
          <Paper key={feature.title} p='md' withBorder>
            <Stack spacing={0}>
              <feature.icon size={48} color={theme.fn.primaryColor()} />
              <Text size='lg' weight='bold'>
                {feature.title}
              </Text>
              <Text size='sm' color='dimmed'>
                {'Create and view '}
                <Anchor
                  component={Link}
                  to={`/${feature.title.toLowerCase()}${
                    feature.my ? '/my' : ''
                  }`}
                >
                  {feature.title.toLowerCase()}
                </Anchor>
              </Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
