import { useExtension } from '../context/ExtensionContext';
import { ExtensionUser, ExtensionCompany, ExtensionMarketplace, ExtensionSettings } from '../context/types';

interface UseExtensionContextResult {
  user: ExtensionUser | null;
  company: ExtensionCompany | null;
  marketplace: ExtensionMarketplace | null;
  settings: ExtensionSettings;
  loading: boolean;
  error: Error | null;
  sessionToken: string | null;
  hasPermission: (permission: string) => boolean;
  isMarketplaceManager: boolean;
}

export function useExtensionContext(): UseExtensionContextResult {
  const context = useExtension();

  const hasPermission = (permission: string): boolean => {
    if (!context.user) return false;
    return context.user.permissions.includes(permission);
  };

  const isMarketplaceManager = context.user?.roles.includes('MARKETPLACE_MANAGER') ?? false;

  return {
    ...context,
    hasPermission,
    isMarketplaceManager,
  };
}


