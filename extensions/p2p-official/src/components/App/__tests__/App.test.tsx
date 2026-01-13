import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import useMarketplaceAccount from "../../../hooks/useMarketplaceAccount";
import { createWrapper } from "../../../../__setup__/utils";
import App from "../index";

expect.extend(toHaveNoViolations);
jest.mock("../../../hooks/useMarketplaceAccount");

const mockedUseMarketplaceAccount =
  useMarketplaceAccount as jest.MockedFunction<typeof useMarketplaceAccount>;

describe("App", () => {
  mockedUseMarketplaceAccount.mockImplementation(() => ({
    data: {},
    isSuccess: true,
    isError: false,
    isLoading: false,
  }));
  window.get_extension_asset = jest.fn();

  it("renders", () => {
    const { container } = render(<App />, {
      wrapper: createWrapper(),
    });
    expect(container).toBeDefined();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<App />, {
      wrapper: createWrapper(),
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
