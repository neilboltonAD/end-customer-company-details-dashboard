export enum FetchStatus {
  success = "success",
  loading = "loading",
  error = "error",
}

export interface Bootstrap {
  UserInfo: {
    [key: string]: unknown;
  } | null;
  CHANNEL_SETTINGS: {
    partner: string;
    [key: string]: unknown;
  };
  CompanyInfo: {
    [key: string]: unknown;
  };
  locale: string;
  [key: string]: unknown;
}

export interface MarketplaceContextResp {
  bootstrap: Bootstrap | undefined;
  theme: unknown;
  tenant: string;
  locale: string;
  status: FetchStatus;
}

export interface ApiResponse {
  data: unknown;
  error: unknown;
}

declare global {
  interface Window {
    bootstrapData: unknown;
  }
}
