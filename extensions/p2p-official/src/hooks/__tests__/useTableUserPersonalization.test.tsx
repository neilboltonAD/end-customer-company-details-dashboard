import { renderHook, act } from "@testing-library/react";
import useTableUserPersonalization from "../useTableUserPersonalization";
import useUpdateUserPersonalization from "../useUpdateUserPersonalization";
import useUserPersonalization from "../useUserPersonalization";

jest.mock("../useUserPersonalization");
jest.mock("../useUpdateUserPersonalization");

describe("useTableUserPersonalization", () => {
  const mockPersonalizationData = {
    userPersonalization: {
      data: {
        density: "xl",
        showFilters: true,
        pageSize: 10,
      },
    },
  };

  (useUserPersonalization as jest.Mock).mockReturnValue({
    data: mockPersonalizationData,
  });
  const mockMutate = jest.fn();
  (useUpdateUserPersonalization as jest.Mock).mockReturnValue({
    mutate: mockMutate,
  });

  it("should update personalization and call mutate", () => {
    const { result } = renderHook(() =>
      useTableUserPersonalization({
        defaultPageSize: 20,
        defaultDensity: "md",
        defaultShowFilters: false,
      }),
    );

    act(() => {
      result.current.updatePersonalization({ pageSize: 30 });
    });

    expect(result.current.pageSize).toBe(30);
    expect(mockMutate).toHaveBeenCalledWith({
      input: {
        applicationId: "micro-ui-ts",
        featureId: "tableDisplaySettings",
        version: 1,
        data: { density: "xl", showFilters: true, pageSize: 30 },
      },
    });
  });
});
