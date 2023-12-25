import { useTranslation } from 'react-i18next';
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconGardenCart,
  IconPaperBag,
  IconShoppingBag,
  IconShoppingCart,
} from '@tabler/icons';
import { useGetProductsStatsQuery } from '../../features/products/products.api';
import { useGetSalesStatsQuery } from '../../features/sales/sales.api';
import { useGetTradesStatsQuery } from '../../features/trades/trades.api';
import { useGetWaresStatsQuery } from '../../features/wares/wares.api';
import { colors } from '../constants';

export default function CustomStats() {
  const [t] = useTranslation();

  const wares = useGetWaresStatsQuery();
  const products = useGetProductsStatsQuery();
  const trades = useGetTradesStatsQuery();
  const sales = useGetSalesStatsQuery();

  const stats = [
    { ...wares, label: 'wares', icon: IconShoppingBag },
    { ...products, label: 'products', icon: IconShoppingCart },
    { ...trades, label: 'trades', icon: IconPaperBag },
    { ...sales, label: 'sales', icon: IconGardenCart },
  ];

  return (
    <SimpleGrid
      cols={4}
      spacing={8}
      breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}
    >
      {stats.map((stat, index) => (
        <Paper key={stat.label} p={8}>
          <Group spacing={0} position='apart'>
            <div>
              <Text size='xs' weight='bold' color='dimmed'>
                {`${t('components.new')} ${t(
                  'navbar.' + stat.label,
                )}`.toUpperCase()}
              </Text>
              <Text size='xl' weight='bold'>
                {stat.data || 0}
              </Text>
            </div>
            <ThemeIcon size={32} color={colors[index]}>
              <stat.icon />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
