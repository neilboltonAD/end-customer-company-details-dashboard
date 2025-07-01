import React, { useState, ReactNode } from 'react';

interface ExpandableSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
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
        <span className="font-semibold text-gray-800">{title}</span>
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