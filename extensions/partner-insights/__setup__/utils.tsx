import React, { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider, createTheme } from "@mantine/core";
import { IntlProvider } from "react-intl";
import enMessages from "../src/translations/en.json";

export const mantineTestTheme = createTheme({
  components: {
    Modal: {
      defaultProps: {
        transitionProps: {
          duration: 0,
        },
      },
    },
    Popover: {
      defaultProps: {
        transitionProps: {
          duration: 0,
        },
      },
    },
    Tooltip: {
      defaultProps: {
        transitionProps: {
          duration: 0,
        },
      },
    },
    Drawer: {
      defaultProps: {
        transitionProps: {
          duration: 0,
        },
      },
    },
    Transition: {
      defaultProps: {
        duration: 0,
      },
    },
  },
});

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: (): void => {},
    },
  });

export const createWrapper = () => {
  const testQueryClient = createTestQueryClient();
  // eslint-disable-next-line
  return function ({ children }: { children: React.ReactNode }): ReactElement {
    return (
      <QueryClientProvider client={testQueryClient}>
        <IntlProvider locale="en" messages={enMessages}>
          <MantineProvider theme={mantineTestTheme}>{children}</MantineProvider>
        </IntlProvider>
      </QueryClientProvider>
    );
  };
};
