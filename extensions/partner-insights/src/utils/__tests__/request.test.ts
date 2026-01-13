import fetch, { enableFetchMocks } from "jest-fetch-mock";
import { fetchGraphQL } from "../request";

enableFetchMocks();

describe("fetchGraphQL", () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.enableMocks();
  });

  it("should make a successful GraphQL request", async () => {
    const mockData = { data: { user: { id: 1, name: "Test" } } };
    fetch.mockResponseOnce(JSON.stringify(mockData), {
      status: 200,
      statusText: "OK",
    });

    const result = await fetchGraphQL(
      "http://example.com/graphql",
      "query { user { id name } }",
      { id: 1 },
      { "Custom-Header": "value" },
    );

    expect(result).toEqual(mockData.data);
    expect(fetch).toHaveBeenCalledWith("http://example.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Custom-Header": "value",
      },
      body: JSON.stringify({
        query: "query { user { id name } }",
        variables: { id: 1 },
      }),
      signal: undefined,
    });
  });

  it("should throw an error for non-200 responses", async () => {
    fetch.mockResponseOnce("", {
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(
      fetchGraphQL("http://example.com/graphql", "query { user { id } }"),
    ).rejects.toThrow("GraphQL request failed: 500 Internal Server Error");
  });

  it("should throw an error when GraphQL response contains errors", async () => {
    const mockError = {
      data: null,
      errors: [{ message: "Field 'user' is required" }],
    };
    fetch.mockResponseOnce(JSON.stringify(mockError), {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json" },
    });

    await expect(
      fetchGraphQL("http://example.com/graphql", "query { user { id } }"),
    ).rejects.toThrow("Field 'user' is required");
  });

  it("should support request cancellation with AbortSignal", async () => {
    fetch.mockAbort();
    const controller = new AbortController();
    const promise = fetchGraphQL(
      "http://example.com/graphql",
      "query { user { id } }",
      undefined,
      undefined,
      controller.signal,
    );

    controller.abort();
    await expect(promise).rejects.toThrow();
  });
});
