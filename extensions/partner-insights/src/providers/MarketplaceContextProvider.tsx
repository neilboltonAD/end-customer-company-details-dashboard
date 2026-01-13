import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { MarketplaceContextResp, Bootstrap, FetchStatus } from "./types";

interface MarketplaceContextProviderProps {
  children: ReactNode;
  placeholder?: ReactNode;
  errorPage?: ReactNode;
}

let bootstrap: Bootstrap | undefined;
let contextTenant = "";
let contextLocale = "";

const INITIAL_CONTEXT = {
  bootstrap: undefined,
  theme: {},
  tenant: "",
  locale: "",
  status: FetchStatus.loading,
} as MarketplaceContextResp;

export const MarketplaceContext = createContext(INITIAL_CONTEXT);

const setResponseData = (
  tenant: string,
  locale: string,
  bootstrapResp: Bootstrap,
): void => {
  bootstrap = bootstrapResp;
  contextTenant = tenant;
  contextLocale = locale;
};

const MarketplaceContextProvider: FC<MarketplaceContextProviderProps> = ({
  children,
  placeholder = <div data-testid="ad-provider-placeholder" />,
  errorPage = <div data-testid="ad-provider-error" />,
}: MarketplaceContextProviderProps) => {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>(
    INITIAL_CONTEXT.status,
  );

  const updateContextOnFetchFail = useCallback((): void => {
    bootstrap = INITIAL_CONTEXT.bootstrap;
    contextTenant = INITIAL_CONTEXT.tenant;
    contextLocale = INITIAL_CONTEXT.locale;
    setFetchStatus(FetchStatus.error);
  }, []);

  const fetchBootstrapContext = useCallback((): void => {
    if (window.bootstrapData?.bootstrap) {
      const { locale } = window.bootstrapData?.bootstrap || {};
      const { partner: tenant } =
        window.bootstrapData?.bootstrap.CHANNEL_SETTINGS || {};
      setResponseData(tenant, locale, window.bootstrapData?.bootstrap);
      setFetchStatus(FetchStatus.success);
    } else {
      console.log("No bootstrap data found");
      updateContextOnFetchFail();
    }
  }, [updateContextOnFetchFail]);

  useEffect(() => {
    fetchBootstrapContext();
  }, [fetchBootstrapContext]);

  const contextValue = {
    bootstrap,
    theme: {},
    status: fetchStatus,
    tenant: contextTenant,
    locale: contextLocale,
  };

  const renderBody = (): React.ReactNode => {
    switch (fetchStatus) {
      case FetchStatus.success:
        return children;
      case FetchStatus.loading:
        return placeholder;
      case FetchStatus.error:
        return errorPage;
      default:
        return errorPage;
    }
  };

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {renderBody()}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceContextProvider;
