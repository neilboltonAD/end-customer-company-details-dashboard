import React from 'react';
import { HelpTooltip } from './HelpTooltip';

interface LearnMoreLinkProps {
  content: string;
  className?: string;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = ({
  content,
  className = '',
}) => {
  return (
    <HelpTooltip content={content} className={className}>
      <span className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:bg-gray-100 p-1 rounded cursor-pointer transition-colors duration-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    </HelpTooltip>
  );
}; 