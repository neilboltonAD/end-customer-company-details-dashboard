import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  ExtensionContext as ExtensionContextType, 
  ExtensionSettings 
} from './types';

const defaultSettings: ExtensionSettings = {
  enableNotifications: true,
  transferExpiryDays: 30,
};

// Demo context - used when running standalone for stakeholder demos
const demoContext: ExtensionContextType = {
  user: {
    id: 'demo-user-1',
    email: 'neil.bolton@appdirect.com',
    firstName: 'Neil',
    lastName: 'Bolton',
    roles: ['MARKETPLACE_MANAGER'],
    permissions: [
      'company.read',
      'company.subscriptions.read',
      'company.subscriptions.write',
      'vendor.microsoft.read',
      'vendor.microsoft.write',
    ],
  },
  company: {
    id: 'company-123',
    name: 'demoresellercustomer3',
    externalId: '7c7cd39e-e239-43c5-b099-0888671761af',
    microsoftTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
    mpnId: '9876543',
  },
  marketplace: {
    id: 'marketplace-1',
    name: 'Demo Marketplace',
    baseUrl: 'https://demo.appdirect.com',
    apiUrl: 'https://demo.appdirect.com/api/graphql',
  },
  settings: defaultSettings,
  loading: false,
  error: null,
  sessionToken: 'demo-session-token',
};

const loadingContext: ExtensionContextType = {
  user: null,
  company: null,
  marketplace: null,
  settings: defaultSettings,
  loading: true,
  error: null,
  sessionToken: null,
};

const ExtensionContext = createContext<ExtensionContextType>(demoContext);

interface ExtensionProviderProps {
  children: ReactNode;
}

export function ExtensionProvider({ children }: ExtensionProviderProps) {
  const [context, setContext] = useState<ExtensionContextType>(loadingContext);

  useEffect(() => {
    // Check if we're embedded in an iframe (production) or standalone (demo)
    const isEmbedded = window.parent !== window;

    if (isEmbedded) {
      // Listen for context from parent window (AppDirect host)
      const handleMessage = (event: MessageEvent) => {
        // In production, validate origin:
        // if (event.origin !== expectedOrigin) return;

        if (event.data?.type === 'EXTENSION_CONTEXT') {
          const { user, company, marketplace, settings, sessionToken } = event.data.payload;
          
          setContext({
            user,
            company,
            marketplace,
            settings: { ...defaultSettings, ...settings },
            loading: false,
            error: null,
            sessionToken,
          });
        }

        if (event.data?.type === 'EXTENSION_ERROR') {
          setContext(prev => ({
            ...prev,
            loading: false,
            error: new Error(event.data.payload.message),
          }));
        }
      };

      window.addEventListener('message', handleMessage);

      // Request context from parent
      window.parent.postMessage({ type: 'REQUEST_EXTENSION_CONTEXT' }, '*');

      // Timeout fallback - if no response from parent, use demo context
      const timeout = setTimeout(() => {
        if (context.loading) {
          console.log('[P2P Extension] No host context received, using demo mode');
          setContext(demoContext);
        }
      }, 2000);

      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(timeout);
      };
    } else {
      // Standalone mode - use demo context immediately
      console.log('[P2P Extension] Running in standalone demo mode');
      // Small delay to simulate loading
      const timeout = setTimeout(() => {
        setContext(demoContext);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [context.loading]);

  return (
    <ExtensionContext.Provider value={context}>
      {children}
    </ExtensionContext.Provider>
  );
}

export function useExtension(): ExtensionContextType {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error('useExtension must be used within ExtensionProvider');
  }
  return context;
}

// Export demo context for testing
export { demoContext };
