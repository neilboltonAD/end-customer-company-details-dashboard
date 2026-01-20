import React from 'react';
import { Tooltip } from 'components/DesignSystem';

interface HelpTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'right' | 'left' | 'top' | 'bottom';
  style?: React.CSSProperties;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  children,
  content,
  position = 'right',
  style,
}) => {
  return (
    <span style={{ display: 'inline-flex', ...style }}>
      <Tooltip label={content} position={position} openDelay={250} width={320}>
        <span style={{ display: 'inline-flex' }}>{children}</span>
      </Tooltip>
    </span>
  );
};