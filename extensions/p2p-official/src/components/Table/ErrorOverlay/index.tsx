import React, { JSX, ReactElement } from "react";
import {
  Button,
  ButtonProps,
  Flex,
  Stack,
  StackProps,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import ErrorWarningFillIcon from "remixicon/icons/System/error-warning-fill.svg";

export interface ErrorOverlayProps {
  title: string;
  description: string;
  SVGIcon?:
    | React.FunctionComponent<React.SVGAttributes<SVGElement>>
    | ReactElement;
  actions?: {
    label: string;
    onClick?: () => void;
    buttonProps?: ButtonProps;
  }[];
  props?: StackProps;
}

const ErrorOverlay = ({
  title,
  description,
  SVGIcon,
  actions,
  props,
}: ErrorOverlayProps): JSX.Element => (
  <Stack data-testid="error-overlay" align="center" {...props}>
    <ThemeIcon color="black" variant="white" size="xl">
      {(SVGIcon &&
        (typeof SVGIcon === "function" ? (
          <SVGIcon data-testid="error-custom-warning-icon" />
        ) : (
          React.cloneElement(SVGIcon)
        ))) ?? (
        <ErrorWarningFillIcon data-testid="error-default-warning-icon" />
      )}
    </ThemeIcon>
    <Title order={1}>{title}</Title>
    <Text size="sm">{description}</Text>
    {actions && (
      <Flex data-testid="error-actions-wrapper" gap="md">
        {actions.map(({ label, onClick, buttonProps }) => (
          <Button {...buttonProps} key={label} onClick={onClick}>
            {label}
          </Button>
        ))}
      </Flex>
    )}
  </Stack>
);

export default ErrorOverlay;
