import React from "react";
import { 
  Alert, Title, Text, Card, Group, Badge, ThemeIcon, Space
} from "@mantine/core";
import { IconChartBar, IconInfoCircle } from "@tabler/icons-react";
import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";
import { usePageTitle } from "../../hooks/usePageTitle";
import { PartnerInsightsPanel } from "../insights/PartnerInsightsPanel";

const App = (): JSX.Element => {
  const { tenant } = useMarketplaceContext();
  usePageTitle("Partner Center Insights");

  return (
    <div data-e2e="microUIPage">
      {/* Demo Mode Banner */}
      <Alert 
        icon={<IconInfoCircle size={16} />} 
        color="orange"
        variant="light"
        mb="md"
        py="xs"
      >
        <Text size="sm"><strong>Demo Mode</strong> — Running with demo data on <strong>{tenant}</strong>. In production, connects to Microsoft Partner Center APIs.</Text>
      </Alert>

      {/* Header */}
      <Card shadow="xs" withBorder mb="md">
        <Card.Section withBorder p="md">
          <Group gap="md">
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} radius="md">
              <IconChartBar size={24} />
            </ThemeIcon>
            <div>
              <Group gap="xs">
                <Title order={2}>Partner Center Insights</Title>
                <Badge color="orange" variant="light" size="sm">DEMO</Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Microsoft 365 analytics, subscription management, and revenue insights
              </Text>
            </div>
          </Group>
        </Card.Section>
      </Card>

      <Space h="md" />

      {/* Main Content */}
      <PartnerInsightsPanel />
    </div>
  );
};

export default App;
