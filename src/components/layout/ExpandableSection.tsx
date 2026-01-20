import React, { useState, useEffect, ReactNode } from 'react';
import { LearnMoreLink } from '../misc/LearnMoreLink';

interface ExpandableSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  sectionId?: string; // Unique identifier for localStorage
  helpContent?: string; // Help content for the Learn more link
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
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
    <div
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 12,
        background: 'white',
        marginBottom: 4,
        boxShadow: 'var(--mantine-shadow-xs)',
      }}
    >
      <button
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          textAlign: 'left',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div style={{ flex: 1, fontWeight: 700, color: 'var(--mantine-color-gray-8)', fontSize: 14, display: 'flex', alignItems: 'center' }}>
          {typeof title === 'string' ? (
            <>
              {title}
              {helpContent && (
                <LearnMoreLink content={helpContent} style={{ marginLeft: 4 }} />
              )}
            </>
          ) : (
            <>
              {title}
              {helpContent && (
                <LearnMoreLink content={helpContent} style={{ marginLeft: 4 }} />
              )}
            </>
          )}
        </div>
        <span style={{ marginLeft: 4, display: 'inline-flex' }}>
          {isOpen ? (
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          ) : (
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          )}
        </span>
      </button>
      {isOpen && <div style={{ padding: '4px 12px 8px' }}>{children}</div>}
    </div>
  );
}; 