import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { fetchGraphQL } from "../utils/request";

const MUTATION = `
  mutation UpdateUserPersonalization($input: UpdateUserPersonalizationInput!) {
    updateUserPersonalization(input: $input) {
      userPersonalization {
        featureId
        data
        version
      }
    }
  }
`;

interface UpdateUserPersonalizationInput {
  featureId: string;
  applicationId: string;
  version: number;
  data: {
    density?: string;
    showFilters?: boolean;
    pageSize?: number;
  };
}

const useUpdateUserPersonalization = (): UseMutationResult<
  unknown,
  Error,
  { input: UpdateUserPersonalizationInput }
> =>
  useMutation({
    mutationFn: (data) =>
      fetchGraphQL("/api/v1/personalization/graphql", MUTATION, data),
  });

export default useUpdateUserPersonalization;
