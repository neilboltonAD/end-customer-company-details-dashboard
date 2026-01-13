const MP_TOKEN_ERROR = "Authentication Token Error";
const EXTERNAL_API_CALL_ERROR = "External API call Error";
const MP_AUTHORIZATION_HEADER = "MP-Authorization";

interface TokenResponse {
  token?: string;
  status?: number;
  errorMessage?: string;
}

interface ServiceAuthTokenAPI {
  getServiceAuthToken(customTokenInvalidTimer?: number): Promise<TokenResponse>;
  fetchExternalData(
    url: string,
    fetchOptions: RequestInit,
    customTokenInvalidTimer?: number,
  ): Promise<ExternalDataFetchResponse>;
  reset(): void;
}

interface ExternalDataFetchResponse {
  status?: number;
  errorMessage?: string;
  response?: unknown;
}

const serviceAuthToken = ((): ServiceAuthTokenAPI => {
  let tokenCreationTime: number;
  let cachedToken: string;
  let tokenValidFor: number = 3000 * 60;

  const getToken = (): Promise<Response> =>
    fetch("/api/v1/personalization/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query personalization {
                userExternalServiceAuthenticationToken {
                    token
                }
            }`,
      }),
    });

  const getServiceAuthToken = async (
    customTokenInvalidTimer?: number,
  ): Promise<TokenResponse> => {
    if (customTokenInvalidTimer) {
      if (
        customTokenInvalidTimer <= 3000 * 60 &&
        customTokenInvalidTimer >= 0
      ) {
        tokenValidFor = customTokenInvalidTimer;
      } else {
        return {
          errorMessage: `${MP_TOKEN_ERROR}: Token invalidation timer must be between 0s and 3min.`,
        };
      }
    }

    if (cachedToken && tokenCreationTime + tokenValidFor >= Date.now()) {
      return { token: cachedToken };
    }
    try {
      const response = await getToken();
      if (!response?.ok) {
        return {
          status: response?.status,
          errorMessage:
            response?.statusText &&
            `${MP_TOKEN_ERROR}: ${response?.statusText}`,
        };
      }
      const tokenData = await response.json();
      cachedToken =
        tokenData?.data?.userExternalServiceAuthenticationToken?.token;
      tokenCreationTime = Date.now();
      return { token: cachedToken };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          errorMessage: `${MP_TOKEN_ERROR}: There was a SyntaxError. ${error}`,
        };
      }
      return { errorMessage: `${MP_TOKEN_ERROR}: ${error}` };
    }
  };

  const fetchExternalData = async (
    url: string,
    fetchOptions: RequestInit,
    customTokenInvalidTimer?: number,
  ): Promise<ExternalDataFetchResponse> => {
    const fetchOptionsWithServiceToken: RequestInit & {
      headers?: Record<string, string>;
    } = { ...fetchOptions };
    const { token, status, errorMessage } = await getServiceAuthToken(
      customTokenInvalidTimer,
    );

    if (token) {
      try {
        if (fetchOptionsWithServiceToken.headers) {
          fetchOptionsWithServiceToken.headers[MP_AUTHORIZATION_HEADER] = token;
        }

        const externalDataResponse = await fetch(url, {
          ...fetchOptionsWithServiceToken,
        });
        if (!externalDataResponse?.ok) {
          return {
            status: externalDataResponse?.status,
            errorMessage: externalDataResponse?.statusText,
          };
        }
        const externalData = await externalDataResponse.json();
        return {
          response: externalData,
        };
      } catch (error) {
        if (error instanceof SyntaxError) {
          return {
            errorMessage: `${EXTERNAL_API_CALL_ERROR}: There was a SyntaxError. ${error}`,
          };
        }
        return {
          errorMessage: `${EXTERNAL_API_CALL_ERROR}: ${error}`,
        };
      }
    } else {
      return { status, errorMessage };
    }
  };

  const reset = (): void => {
    cachedToken = "";
  };

  return {
    getServiceAuthToken,
    fetchExternalData,
    reset,
  };
})();

export default serviceAuthToken;
