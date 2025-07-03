import React, { useState, useRef, useEffect } from 'react';

interface HelpTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'right' | 'left' | 'top' | 'bottom';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  children,
  content,
  position = 'right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setShowTooltip(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'right':
      default:
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${getPositionClasses()}`}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg max-w-sm min-w-64 transition-all duration-200 ease-in-out ${
              showTooltip 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-2'
            }`}
          >
            {content}
            {/* Arrow */}
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
}; 