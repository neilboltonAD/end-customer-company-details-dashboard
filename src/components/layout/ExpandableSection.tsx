import React, { useState, useEffect, ReactNode } from 'react';
import { LearnMoreLink } from '../misc/LearnMoreLink';

interface ExpandableSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  sectionId?: string; // Unique identifier for localStorage
  helpContent?: string; // Help content for the Learn more link
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  className = '',
  sectionId,
  helpContent,
}) => {
  // Generate a unique ID if not provided
  const uniqueId = sectionId || `section-${typeof title === 'string' ? title.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9)}`;
  
  // Get initial state from localStorage or default to false (collapsed)
  const getInitialState = (): boolean => {
    if (typeof window === 'undefined') return false; // SSR safety
    
    try {
      const saved = localStorage.getItem(`expandable-section-${uniqueId}`);
      return saved ? JSON.parse(saved) : false; // Default to collapsed
    } catch (error) {
      console.warn('Failed to load expandable section state from localStorage:', error);
      return false; // Default to collapsed on error
    }
  };

  const [internalOpen, setInternalOpen] = useState(getInitialState);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety
    
    try {
      localStorage.setItem(`expandable-section-${uniqueId}`, JSON.stringify(isOpen));
    } catch (error) {
      console.warn('Failed to save expandable section state to localStorage:', error);
    }
  }, [isOpen, uniqueId]);
  
  const handleToggle = () => {
    const newOpen = !isOpen;
    if (onToggle) {
      onToggle(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <div className={`border-2 border-gray-300 rounded-lg bg-white mb-4 py-2 shadow-sm ${className}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none hover:bg-gray-50 rounded-t-lg transition-colors"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="flex-1 font-semibold text-gray-800 flex items-center">
          {typeof title === 'string' ? (
            <>
              {title}
              {helpContent && (
                <LearnMoreLink content={helpContent} className="ml-2" />
              )}
            </>
          ) : (
            <>
              {title}
              {helpContent && (
                <LearnMoreLink content={helpContent} className="ml-2" />
              )}
            </>
          )}
        </div>
        <span className="ml-2">
          {isOpen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          )}
        </span>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}; 