import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { Loader, Text } from "@mantine/core";

interface ResultCountProps {
  resultCount: number;
  isLoading?: boolean;
}

const ResultCount = ({
  resultCount,
  isLoading = false,
}: ResultCountProps): ReactElement => {
  const { formatMessage } = useIntl();

  const getResultCountText = (): string => {
    if (resultCount === 1) {
      return formatMessage({ id: "table.filters.result.count.one" });
    }
    return formatMessage(
      { id: "table.filters.result.count.many" },
      { count: resultCount },
    );
  };
  return isLoading ? (
    <Loader color="gray" size="xs" />
  ) : (
    <Text size="sm">{getResultCountText()}</Text>
  );
};

export default ResultCount;
