import React from "react";
import { Text, Title, Card, ThemeIcon, Flex, Badge, Group } from "@mantine/core";
import { IconArrowsExchange } from "@tabler/icons-react";

const Header = (): JSX.Element => {
  return (
    <Card shadow="xs" withBorder>
      <Card.Section withBorder p="xs">
        <Flex align="center" gap="xs">
          <ThemeIcon variant="gradient" gradient={{ from: 'teal', to: 'blue' }} size="xl" radius="md">
            <IconArrowsExchange style={{ width: "60%", height: "60%" }} />
          </ThemeIcon>
          <div>
            <Group gap="xs">
              <Title order={1}>P2P Transfers</Title>
              <Badge color="orange" variant="light" size="sm">DEMO</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Partner to Partner Subscription Transfer Management
            </Text>
          </div>
        </Flex>
      </Card.Section>
    </Card>
  );
};

export default Header;
