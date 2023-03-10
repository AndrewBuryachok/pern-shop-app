import {
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';
import { useGetGoodsStatsQuery } from '../../features/goods/goods.api';
import { useGetProductsStatsQuery } from '../../features/products/products.api';
import { useGetSalesStatsQuery } from '../../features/sales/sales.api';
import { useGetTradesStatsQuery } from '../../features/trades/trades.api';
import { useGetWaresStatsQuery } from '../../features/wares/wares.api';

export default function CustomStats() {
  const goods = useGetGoodsStatsQuery();
  const wares = useGetWaresStatsQuery();
  const products = useGetProductsStatsQuery();
  const trades = useGetTradesStatsQuery();
  const sales = useGetSalesStatsQuery();

  const stats = [
    { ...goods.data!, isLoading: goods.isLoading, label: 'goods' },
    { ...wares.data!, isLoading: wares.isLoading, label: 'wares' },
    { ...products.data!, isLoading: products.isLoading, label: 'products' },
    { ...trades.data!, isLoading: trades.isLoading, label: 'trades' },
    { ...sales.data!, isLoading: sales.isLoading, label: 'sales' },
  ].map((stat) => ({
    ...stat,
    type: stat.current < stat.previous,
  }));

  return (
    <SimpleGrid
      cols={5}
      spacing={8}
      breakpoints={[
        { maxWidth: 'xl', cols: 4 },
        { maxWidth: 'lg', cols: 3 },
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}
    >
      {stats.map((stat) => (
        <Skeleton key={stat.label} visible={stat.isLoading}>
          <Paper p={8}>
            <Group position='apart' spacing={0}>
              <div>
                <Text size='xs' weight='bold' color='dimmed'>
                  {`new ${stat.label}`.toUpperCase()}
                </Text>
                <Text size='xl' weight='bold'>
                  {stat.current || 0}
                </Text>
              </div>
              <ThemeIcon
                size={32}
                variant='light'
                color={stat.type ? 'red' : 'green'}
              >
                {stat.type ? (
                  <IconArrowDownRight size={32} />
                ) : (
                  <IconArrowUpRight size={32} />
                )}
              </ThemeIcon>
            </Group>
            <Text size='sm' weight='bold' color={stat.type ? 'red' : 'green'}>
              {stat.type ? '-' : '+'}
              {stat.previous
                ? Math.floor(Math.abs(stat.current / stat.previous - 1) * 100)
                : stat.current
                ? 100
                : 0}
              %
            </Text>
            <Text size='xs' color='dimmed'>
              Compared to previous month
            </Text>
          </Paper>
        </Skeleton>
      ))}
    </SimpleGrid>
  );
}
