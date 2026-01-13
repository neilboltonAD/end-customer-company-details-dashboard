import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { request, gql } from "graphql-request";

const GET_ACCOUNT = gql`
  query {
    me {
      id
      firstName
      lastName
      email
      currentMembership {
        roles
        account {
          name
          id
        }
      }
    }
  }
`;

const fetch = async (): Promise<unknown> => {
  return request("/api/graphql", GET_ACCOUNT);
};

const useMarkeplaceAccount = (): UseQueryResult<unknown> =>
  useQuery({ queryKey: [`account_me`], queryFn: () => fetch(), gcTime: 0 });

export default useMarkeplaceAccount;
