import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge, Card, Grid, Inline, Stack, Text, Title, Tooltip } from 'components/DesignSystem';

export const CompanySummaryCard = () => {
  // Mock data from Partner Center Insights
  const insights = {
    totalSeats: 350,
    activeUsers: 245,
    subscriptions: 8,
    monthlyRevenue: 12450,
    totalSpent: 149400, // Annual calculation
    unpaidInvoices: 0,
    trends: {
      seats: 5.2,
      activeUsers: -2.3,
      revenue: 8.7
    }
  };

  const usagePercentage = ((insights.activeUsers / insights.totalSeats) * 100).toFixed(1);

  return (
    <Card style={{ marginBottom: 24 }}>
      <Stack gap="md">
        <Inline justify="space-between" align="center" wrap="nowrap">
          <Inline gap="md" align="center" wrap="nowrap">
            <div
              style={{
                width: 80,
                height: 80,
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: 12,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
              }}
            >
              <span>🏢</span>
            </div>
            <div>
              <Inline gap="sm" align="center" wrap="nowrap">
                <Text fw={700}>Company</Text>
                <Badge color="success" variant="outline">
                  Enabled
                </Badge>
              </Inline>
              <Title order={3} fw={800} m={0}>
                AppDirect Demonstration 5
              </Title>
              <Inline gap="xs" align="center">
                <Text size="xs" c="dimmed">
                  <Text span fw={700}>
                    {insights.subscriptions}
                  </Text>{' '}
                  Active Subscriptions
                </Text>
                <Text size="xs" c="dimmed">
                  •
                </Text>
                <Text size="xs" c="dimmed">
                  <Text span fw={700}>
                    {usagePercentage}%
                  </Text>{' '}
                  License Utilization
                </Text>
              </Inline>
            </div>
          </Inline>
        </Inline>

        <Card style={{ background: 'var(--mantine-color-gray-0)' }}>
          <Grid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
            {[
          { 
            label: 'Total Seats', 
            value: insights.totalSeats,
            trend: insights.trends.seats,
            info: 'Microsoft 365 licenses'
          },
          { 
            label: 'Active Users (28d)', 
            value: insights.activeUsers,
            trend: insights.trends.activeUsers,
            info: 'Users actively using licenses'
          },
          { 
            label: 'Monthly Revenue', 
            value: `$${insights.monthlyRevenue.toLocaleString()}`,
            trend: insights.trends.revenue,
            info: 'Recurring monthly revenue'
          },
          { 
            label: 'Total Spent (12m)', 
            value: `$${insights.totalSpent.toLocaleString()}`,
            info: 'Last 12 months'
          },
          { 
            label: 'Active Subscriptions', 
            value: insights.subscriptions,
            info: 'Microsoft products'
          },
          { 
            label: 'Unpaid Invoices', 
            value: insights.unpaidInvoices,
            info: 'Outstanding invoices'
          },
            ].map((item) => {
              const trend = item.trend;
              const trendColor = trend === undefined ? undefined : trend > 0 ? 'var(--mantine-color-green-7)' : 'var(--mantine-color-red-7)';

              return (
                <Tooltip key={item.label} label={item.info}>
                  <Card>
                    <Stack gap={6} align="center">
                      <Inline gap={6} align="center" wrap="nowrap">
                        <Text fw={800}>{item.value}</Text>
                        {trend !== undefined && (
                          <>
                            {trend > 0 ? <TrendingUp size={14} /> : trend < 0 ? <TrendingDown size={14} /> : null}
                          </>
                        )}
                      </Inline>
                      <Text size="xs" c="dimmed" ta="center">
                        {item.label}
                      </Text>
                      {trend !== undefined && (
                        <Text size="xs" fw={700} style={{ color: trendColor }}>
                          {trend > 0 ? '+' : ''}
                          {trend}%
                        </Text>
                      )}
                    </Stack>
                  </Card>
                </Tooltip>
              );
            })}
          </Grid>
        </Card>
      </Stack>
    </Card>
  );
}; 