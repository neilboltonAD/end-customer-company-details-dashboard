import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { MRT_DensityState } from "mantine-react-table-open";
import { fetchGraphQL } from "../utils/request";

interface UserPersonalization {
  featureId: string;
  version: string;
  data: {
    density?: MRT_DensityState;
    showFilters?: boolean;
    pageSize?: number;
  };
  applicationId: string;
}

interface UserPersonalizationResponse {
  userPersonalization: UserPersonalization;
}

const QUERY = `
  query userPersonalization($featureId: String!, $applicationId: String!) {
    userPersonalization(featureId: $featureId, applicationId: $applicationId) {
      featureId
      version
      data
      applicationId
    }
  }
`;

const createTimeoutSignal = (ms: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};

const useUserPersonalization = (
  featureId: string,
  applicationId: string,
): UseQueryResult<UserPersonalizationResponse> => {
  return useQuery({
    queryKey: ["userPersonalization", featureId, applicationId],
    queryFn: async () => {
      const signal = createTimeoutSignal(3000);
      const response = await fetchGraphQL<UserPersonalizationResponse>(
        "/api/v1/personalization/graphql",
        QUERY,
        { featureId, applicationId },
        undefined,
        signal,
      );
      return response;
    },
  });
};

export default useUserPersonalization;
