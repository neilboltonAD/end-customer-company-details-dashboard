import React from 'react';
import { HelpTooltip } from './HelpTooltip';
import { ActionIcon } from 'components/DesignSystem';

interface LearnMoreLinkProps {
  content: string;
  style?: React.CSSProperties;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = ({
  content,
  style,
}) => {
  return (
    <HelpTooltip content={content} style={style}>
      <ActionIcon
        aria-label="Learn more"
        size="xs"
        customFill="transparent"
        customBorder="1px solid transparent"
        style={{ color: 'var(--mantine-color-blue-6)' }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </ActionIcon>
    </HelpTooltip>
  );
}; 