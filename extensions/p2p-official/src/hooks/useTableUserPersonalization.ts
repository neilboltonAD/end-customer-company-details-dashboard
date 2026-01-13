import { useEffect, useState } from "react";
import { MRT_DensityState as MRTDensityState } from "mantine-react-table-open";
import useUserPersonalization from "./useUserPersonalization";
import useUpdateUserPersonalization from "./useUpdateUserPersonalization";

const APPLICATION_ID = "micro-ui-ts";
const FEATURE_ID = "tableDisplaySettings";

const USER_PERSONALIZATION_INPUT = {
  featureId: FEATURE_ID,
  version: 1,
  applicationId: APPLICATION_ID,
};

interface PersonalizationData {
  density: MRTDensityState;
  showFilters: boolean;
  pageSize: number;
}

const useTableUserPersonalization = ({
  defaultPageSize,
  defaultDensity,
  defaultShowFilters,
}: {
  defaultPageSize: number;
  defaultDensity: MRTDensityState;
  defaultShowFilters: boolean;
}): PersonalizationData & {
  updatePersonalization: (newData: Partial<PersonalizationData>) => void;
} => {
  const { data: personalizationData } = useUserPersonalization(
    FEATURE_ID,
    APPLICATION_ID,
  );
  const updateUserPersonalization = useUpdateUserPersonalization();

  const initialState: PersonalizationData = {
    density:
      personalizationData?.userPersonalization.data?.density || defaultDensity,
    showFilters:
      personalizationData?.userPersonalization.data?.showFilters ||
      defaultShowFilters,
    pageSize:
      personalizationData?.userPersonalization.data?.pageSize ||
      defaultPageSize,
  };

  const [personalization, setPersonalization] =
    useState<PersonalizationData>(initialState);

  useEffect(() => {
    if (personalizationData) {
      setPersonalization({
        density:
          personalizationData.userPersonalization.data?.density ??
          defaultDensity,
        showFilters:
          personalizationData.userPersonalization.data?.showFilters ??
          defaultShowFilters,
        pageSize:
          personalizationData.userPersonalization.data?.pageSize ??
          defaultPageSize,
      });
    }
  }, [
    personalizationData?.userPersonalization.data?.density,
    personalizationData?.userPersonalization.data?.showFilters,
    personalizationData?.userPersonalization.data?.pageSize,
  ]);

  const updatePersonalization = (
    newData: Partial<PersonalizationData>,
  ): void => {
    setPersonalization((prev) => {
      const updatedData = { ...prev, ...newData };

      updateUserPersonalization.mutate({
        input: {
          ...USER_PERSONALIZATION_INPUT,
          data: updatedData,
        },
      });
      return updatedData;
    });
  };
  return {
    ...personalization,
    updatePersonalization,
  };
};

export default useTableUserPersonalization;
