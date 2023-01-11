import {
  Card,
  Container,
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
  IconUsers,
} from '@tabler/icons';

export default function Home() {
  useDocumentTitle('Home | Shop');

  const theme = useMantineTheme();

  const features = [
    {
      title: 'Users',
      icon: IconUsers,
    },
    {
      title: 'Cards',
      icon: IconCreditCard,
    },
    {
      title: 'Payments',
      icon: IconCashBanknote,
    },
    {
      title: 'Exchanges',
      icon: IconExchange,
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
    },
    {
      title: 'Sales',
      icon: IconGardenCart,
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
    },
    {
      title: 'Leases',
      icon: IconReportMoney,
    },
    {
      title: 'Polls',
      icon: IconChartBar,
    },
    {
      title: 'Votes',
      icon: IconNotes,
    },
  ];

  return (
    <Container>
      <Stack align='center'>
        <Title order={1}>Online shop app</Title>
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'xl', cols: 3 },
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 },
          ]}
        >
          {features.map((feature) => (
            <Card key={feature.title} shadow='md' radius='md'>
              <Stack spacing={8}>
                <feature.icon size={48} color={theme.fn.primaryColor()} />
                <Text size='lg' weight='bold'>
                  {feature.title}
                </Text>
                <Text size='sm' color='dimmed'>
                  {`Create and view ${feature.title.toLowerCase()}`}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
