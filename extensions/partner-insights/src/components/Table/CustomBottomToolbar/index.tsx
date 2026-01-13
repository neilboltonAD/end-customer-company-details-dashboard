import React, { useEffect, useState, useMemo, ReactElement } from "react";
import { useIntl } from "react-intl";
import { Flex, Select, ActionIcon, Text } from "@mantine/core";
import PreviousPageIcon from "remixicon/icons/Arrows/arrow-left-s-line.svg";
import NextPageIcon from "remixicon/icons/Arrows/arrow-right-s-line.svg";
import { MRT_PaginationState as PaginationState } from "mantine-react-table-open";
import {
  getFormattedPageCount,
  getFormattedPageSize,
  getNumOfRowsPerPageOptions,
} from "./utils";

export interface CustomBottomToolbarProps {
  paginationState: PaginationState;
  onPageSizeChange: (pageSize: number) => void;
  isDisabled?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  totalNumOfRows: number | undefined;
  isFetching?: boolean;
  numberOfSelectedRowsText?: string; // if row selection is enabled
}

const CustomBottomToolbar = ({
  paginationState,
  onPageSizeChange,
  onNextPage,
  onPreviousPage,
  isDisabled = false,
  hasNextPage,
  hasPreviousPage,
  totalNumOfRows = 0,
  isFetching = false,
  numberOfSelectedRowsText,
}: CustomBottomToolbarProps): ReactElement => {
  const { formatMessage } = useIntl();
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setRowCount(totalNumOfRows);
  }, [totalNumOfRows]);

  const onPageSizeChangeHandler = (newPageSize: string | null): void => {
    onPageSizeChange(getFormattedPageSize(newPageSize));
  };

  const formattedPageLegend = getFormattedPageCount(
    paginationState.pageIndex,
    paginationState.pageSize,
    rowCount,
    formatMessage,
  );

  const numOfRowsPerPageOptions = useMemo(
    () => getNumOfRowsPerPageOptions(rowCount),
    [rowCount],
  );

  return (
    <Flex
      px="md"
      py="xshalf"
      justify="space-between"
      align="center"
      style={{
        borderTop: "1px solid var(--mantine-color-gray-3)",
        background: "var(--mantine-color-gray-1)",
      }}
    >
      <Flex align="center" gap="sm">
        <Text size="xs">{formatMessage({ id: "table.rows.per.page" })}</Text>
        <Select
          disabled={!rowCount || isDisabled}
          aria-label={formatMessage({ id: "table.rows.per.page" })}
          data={numOfRowsPerPageOptions}
          value={paginationState.pageSize.toString()}
          onChange={onPageSizeChangeHandler}
          size="xs"
          maw={65}
          variant="unstyled"
          comboboxProps={{ withinPortal: false }}
          styles={{
            option: {
              fontSize: "var(--mantine-font-size-xs)",
            },
            input: {
              fontSize: "var(--mantine-font-size-xs)",
              background: "var(--mantine-color-gray-1)",
            },
          }}
        />
      </Flex>
      {numberOfSelectedRowsText && (
        <Text size="xs">{numberOfSelectedRowsText}</Text>
      )}
      <Flex align="center" gap="xs">
        <Text size="xs" data-testid="page-count">
          {formattedPageLegend}
        </Text>
        <ActionIcon
          data-testid="previous-page-btn"
          disabled={!hasPreviousPage || isDisabled}
          onClick={(): void => {
            if (!isFetching && onPreviousPage) {
              onPreviousPage();
            }
          }}
          variant="subtle"
          color="black"
          w={30}
          aria-label={formatMessage({ id: "table.previous.page.aria" })}
        >
          <PreviousPageIcon style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
        <ActionIcon
          data-testid="next-page-btn"
          disabled={!hasNextPage || isDisabled}
          onClick={(): void => {
            if (!isFetching && onNextPage) {
              onNextPage();
            }
          }}
          variant="subtle"
          color="black"
          w={30}
          aria-label={formatMessage({ id: "table.next.page.aria" })}
        >
          <NextPageIcon style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

export default CustomBottomToolbar;
