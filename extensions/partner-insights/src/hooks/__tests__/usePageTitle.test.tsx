import { renderHook, waitFor } from "@testing-library/react";
import { usePageTitle } from "../usePageTitle";

describe("usePageTitle", () => {
  beforeEach(() => {
    document.title = "";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets document.title with the provided title and marketplace name", async () => {
    renderHook(
      ({ title, marketplaceName }) => usePageTitle(title, marketplaceName),
      {
        initialProps: { title: "My Page", marketplaceName: "AppDirect" },
      },
    );

    await waitFor(() => expect(document.title).toBe("My Page | AppDirect"));
  });

  it("sets document.title with only the title when marketplace name is not provided", async () => {
    renderHook(
      ({ title, marketplaceName }) => usePageTitle(title, marketplaceName),
      {
        initialProps: { title: "My Page", marketplaceName: "" },
      },
    );

    await waitFor(() => expect(document.title).toBe("My Page"));
  });

  it("updates document.title when the title changes", async () => {
    const { rerender } = renderHook(
      ({ title, marketplaceName }) => usePageTitle(title, marketplaceName),
      {
        initialProps: { title: "Initial", marketplaceName: "AppDirect" },
      },
    );

    await waitFor(() => expect(document.title).toBe("Initial | AppDirect"));

    rerender({ title: "Updated", marketplaceName: "AppDirect" });

    await waitFor(() => expect(document.title).toBe("Updated | AppDirect"));
  });

  it("does not set document.title when title is empty", async () => {
    renderHook(
      ({ title, marketplaceName }) => usePageTitle(title, marketplaceName),
      {
        initialProps: { title: "", marketplaceName: "AppDirect" },
      },
    );

    await waitFor(() => expect(document.title).toBe(""));
  });
});
