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
      <span className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:bg-gray-100 px-2 py-1 rounded text-sm font-medium cursor-pointer transition-colors duration-200">
        Learn more
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    </HelpTooltip>
  );
}; 