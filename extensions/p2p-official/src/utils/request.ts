/**
 * Typical shape of a GraphQL response
 */
export interface GraphQLResponse<TData> {
  data?: TData;
  errors?: Array<{
    message?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

/**
 * Minimal GraphQL fetcher for TanStack Query integration.
 *
 *  - Uses `async`/`await` so the function returns a Promise of `GraphQLResponse<TData>`.
 *  - Throws only on network errors (non-2xx responses).
 *  - Returns the **entire** parsed JSON (including `data`, `errors`, etc.).
 */
export async function fetchGraphQL<TData = unknown>(
  url: string,
  query: string,
  variables?: Record<string, unknown>,
  headers?: Record<string, string>,
  signal?: AbortSignal,
): Promise<TData> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`,
    );
  }

  const result = (await response.json()) as GraphQLResponse<TData>;

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  return result.data as TData;
}
