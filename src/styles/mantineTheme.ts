import { Avatar, Card, MantineColorsTuple, MantineThemeOverride } from '@mantine/core';

// Open Color "blue" palette (10 steps), with a11y-compliant blue[6] per reference repo.
const accessibleBlue: MantineColorsTuple = [
  '#e7f5ff',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#4dabf7',
  '#339af0',
  '#326FDE', // blue.6 - A11y compliant (WCAG AA)
  '#1c7ed6',
  '#1971c2',
  '#1864ab',
];

export const mantineTheme: MantineThemeOverride = {
  primaryColor: 'blue',
  colors: {
    blue: accessibleBlue,
  },

  defaultRadius: 'sm',
  fontFamily:
    // Keep it safe for CRA (no Next font variables). If you later add Inter, it will be used automatically.
    'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Avatar: Avatar.extend({
      styles: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid var(--mantine-color-gray-4)',
        },
        placeholder: {
          backgroundColor: '#ffffff',
          color: 'var(--mantine-color-dimmed)',
        },
      },
    }),
    Card: Card.extend({
      styles: {
        root: {
          transition: 'box-shadow 200ms ease, transform 200ms ease',
          '&.ds-card--interactive:hover': {
            boxShadow: 'var(--mantine-shadow-md)',
            transform: 'translateY(-2px)',
          },
        },
      },
    }),
  },
};

