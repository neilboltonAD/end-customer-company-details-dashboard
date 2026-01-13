import { ActionIcon, Button, Text, Group, rem } from "@mantine/core";
import React, { ReactNode, type ReactElement } from "react";
import { IconX } from "@tabler/icons-react";

interface CustomToolbarAlertBannerContentAction {
  SVGIcon: ReactNode;
  label: string;
  onClick: () => void;
}

interface CustomToolbarAlertBannerContentProps {
  resetRowSelection: () => void;
  numberOfSelectedRowsText?: string;
  actions: CustomToolbarAlertBannerContentAction[];
}

const CustomToolbarAlertBannerContent = ({
  resetRowSelection,
  numberOfSelectedRowsText,
  actions,
}: CustomToolbarAlertBannerContentProps): ReactElement => {
  return (
    <Group gap="xs">
      <ActionIcon
        size="md"
        variant="transparent"
        color="white"
        onClick={resetRowSelection}
        aria-label="close"
      >
        <IconX style={{ width: rem(14), height: rem(14) }} />
      </ActionIcon>
      {actions.map((action: CustomToolbarAlertBannerContentAction) => (
        <Button
          onClick={action.onClick}
          size="xs"
          variant="outline"
          leftSection={action.SVGIcon}
          color="white"
          key={action.label}
          aria-label={action.label}
        >
          {action.label}
        </Button>
      ))}
      <Text size="sm">{numberOfSelectedRowsText}</Text>
    </Group>
  );
};

export default CustomToolbarAlertBannerContent;
