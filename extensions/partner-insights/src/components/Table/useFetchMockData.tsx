/* eslint-disable */
/* istanbul ignore file */
// Replace with your own query and API logic
// this is not an example of how to use react-query
import {
  useQuery,
  UseQueryResult,
  keepPreviousData,
} from "@tanstack/react-query";

export interface Person {
  id: number;
  name: string;
  age: number;
  city: string;
  appliedOn: string;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FetchPersonResponse {
  nodes: Person[];
  pageInfo: PageInfo;
  totalCount?: number;
}

interface OrderBy {
  field: string;
  direction: "ASC" | "DESC";
}

export interface FetchInput {
  first?: number | null;
  last?: number | null;
  before?: string | null;
  after?: string | null;
  orderBy?: OrderBy | null;
  filter: any;
  searchTerm?: string;
}

// Mock data
const generateMockData = (num: number) => {
  const cities = ["New York", "Los Angeles", "Denver", "Chicago", "Houston"];
  const names = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Robert Phillips",
    "Charlie Rodgers",
    "Emily Davis",
    "Michael Brown",
    "Esteban Julio Ricardo Montoya de la Rosa Ramírez",
  ];
  const mockData: Person[] = [];

  for (let i = 0; i <= num; i++) {
    const name = names[i % names.length];
    const city = cities[i % cities.length];
    const age = 25 + (i % 20); // Age between 25 and 45
    const appliedOn = `2024-09-${String(i).padStart(2, "0")}`;

    mockData.push({
      id: i,
      name: `${name} ${i}`, // Ensure unique name
      age: age,
      city: city,
      appliedOn: appliedOn,
    });
  }

  return mockData;
};

const mockData = generateMockData(100);

const filterData = (
  data: Person[],
  filter: any,
  searchTerm?: string,
): Person[] => {
  const { city, dateRange } = filter || {};
  let filteredData = data;
  if (city) {
    filteredData = filteredData.filter((person) => person.city === city);
  }
  if (dateRange) {
    filteredData = filteredData.filter((person) => {
      const [year, month, day] = person.appliedOn.split("-").map(Number);
      const appliedOn = new Date(year, month - 1, day);
      return appliedOn >= dateRange.start && appliedOn <= dateRange.end;
    });
  }
  if (searchTerm) {
    filteredData = filteredData.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
  return filteredData;
};

const sortData = (data: Person[], orderBy?: OrderBy | null): Person[] => {
  if (!orderBy) return data;

  return data.sort((a, b) => {
    const fieldA = a[orderBy.field];
    const fieldB = b[orderBy.field];

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return orderBy.direction === "ASC"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return orderBy.direction === "ASC" ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0; // In case of different types or undefined fields
  });
};

const paginateData = (
  data: Person[],
  first: number | null | undefined,
  last: number | null | undefined,
  before: string | null | undefined,
  after: string | null | undefined,
): { paginatedData: Person[]; pageInfo: PageInfo } => {
  let startIndex = 0;
  let endIndex = data.length;

  if (after) {
    const afterIndex = data.findIndex(
      (person) => person.id === parseInt(after),
    );
    if (afterIndex !== -1) {
      startIndex = afterIndex + 1;
    }
  }

  if (before) {
    const beforeIndex = data.findIndex(
      (person) => person.id === parseInt(before),
    );
    if (beforeIndex !== -1) {
      endIndex = beforeIndex;
    }
  }

  if (first) {
    endIndex = Math.min(startIndex + first, data.length);
  }

  if (last) {
    startIndex = Math.max(endIndex - last, 0);
  }

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    paginatedData,
    pageInfo: {
      startCursor:
        paginatedData.length > 0 ? paginatedData[0].id.toString() : "",
      endCursor:
        paginatedData.length > 0
          ? paginatedData[paginatedData.length - 1].id.toString()
          : "",
      hasNextPage: endIndex < data.length,
      hasPreviousPage: startIndex > 0,
    },
  };
};

const useFetchMockData = ({
  first,
  last,
  before,
  after,
  orderBy,
  filter,
  searchTerm,
}: FetchInput): UseQueryResult<FetchPersonResponse> => {
  return useQuery({
    queryKey: [
      "data",
      `${first}-${last}-${before}-${after}-${orderBy?.field}-${orderBy?.direction}-${filter?.city}-${searchTerm}-${filter?.dateRange?.start}-${filter?.dateRange?.end}`,
    ],
    queryFn: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });

      let filteredData = filterData(mockData, filter, searchTerm);
      let sortedData = sortData(filteredData, orderBy);
      let { paginatedData, pageInfo } = paginateData(
        sortedData,
        first,
        last,
        before,
        after,
      );

      return {
        nodes: paginatedData,
        pageInfo,
        totalCount: sortedData.length,
      };
    },
    gcTime: 3000,
    placeholderData: keepPreviousData,
  });
};

export default useFetchMockData;
