import React, { JSX, useEffect, useMemo, useState, useRef } from "react";
import { useIntl } from "react-intl";
import {
  useMantineReactTable,
  MantineReactTable,
  createMRTColumnHelper,
  MRT_PaginationState as PaginationState,
  MRT_RowSelectionState as RowSelectionState,
  MRT_DensityState as DensityState,
} from "mantine-react-table-open";
import { rem } from "@mantine/core";
import FullscreenIcon from "remixicon/icons/Media/fullscreen-line.svg";
import FullscreenExitIcon from "remixicon/icons/Media/fullscreen-exit-line.svg";
import AlignJustifyIcon from "remixicon/icons/Editor/align-justify.svg";
import SearchIcon from "remixicon/icons/System/search-line.svg";
import DeleteIcon from "remixicon/icons/System/delete-bin-5-line.svg";
import useFetchMockData, { Person, FetchInput } from "./useFetchMockData";
import CustomBottomToolbar from "./CustomBottomToolbar";
import SortableHeaderCell, { SortDirection } from "./SortableHeaderCell";
import CustomTopToolbar from "./CustomTopToolbar";
import ErrorOverlay from "./ErrorOverlay";
import styles from "./table.module.css";
import CustomToolbarAlertBannerContent from "./CustomToolbartAlertBannerContent";
import useTableUserPersonalization from "../../hooks/useTableUserPersonalization";

const PAGE_SIZE_DEFAULT = 5;

const resetCursors = (prevInput: FetchInput, pageSize: number): FetchInput => ({
  ...prevInput,
  first: pageSize,
  after: null,
  before: null,
  last: null,
});

const IconWrapper = ({ IconComponent, ...props }): JSX.Element => (
  <IconComponent
    {...props}
    style={{ width: rem(14), height: rem(14) }}
    color="black"
  />
);

const replacedIcons = {
  IconMaximize: (props): JSX.Element => (
    <IconWrapper IconComponent={FullscreenIcon} {...props} />
  ),
  IconMinimize: (props): JSX.Element => (
    <IconWrapper IconComponent={FullscreenExitIcon} {...props} />
  ),
  IconBaselineDensitySmall: (props): JSX.Element => (
    <IconWrapper IconComponent={AlignJustifyIcon} {...props} />
  ),
  IconBaselineDensityMedium: (props): JSX.Element => (
    <IconWrapper IconComponent={AlignJustifyIcon} {...props} />
  ),
  IconBaselineDensityLarge: (props): JSX.Element => (
    <IconWrapper IconComponent={AlignJustifyIcon} {...props} />
  ),
};

interface TableProps {
  locale: string;
}

const Table = ({ locale }: TableProps): JSX.Element => {
  "use no memo";

  const { formatMessage } = useIntl();

  const [input, setInput] = useState<FetchInput>({
    first: PAGE_SIZE_DEFAULT,
    after: null,
    last: null,
    before: null,
    orderBy: null,
    filter: {
      city: null,
    },
    searchTerm: "",
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading, isFetching, isError, refetch } =
    useFetchMockData(input);

  const [sortingState, setSortingState] = useState({
    field: undefined,
    direction: SortDirection.DEFAULT,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [filters, setFilters] = useState({
    city: null,
    dateRange: null,
    searchTerm: "",
  });

  const { density, showFilters, pageSize, updatePersonalization } =
    useTableUserPersonalization({
      defaultDensity: "md",
      defaultShowFilters: true,
      defaultPageSize: PAGE_SIZE_DEFAULT,
    });

  const densityRef = useRef<DensityState>(density || "md");

  const getNumberOfSelectedRowsText = (
    rowSelectionState: RowSelectionState,
  ): string | undefined => {
    const count = Object.keys(rowSelectionState).filter(
      (key) => rowSelectionState[key],
    ).length;
    return count > 0
      ? formatMessage({ id: "table.row.selected.count" }, { count })
      : undefined;
  };

  useEffect(() => {
    densityRef.current = density;
  }, [density]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
    }));
    setInput((prevInput) => ({
      ...prevInput,
      first: pageSize,
      after: null,
      last: null,
      before: null,
    }));
  }, [pageSize]);

  const onFiltersChange = (newFilters): void => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    // modify the input object to include the filters, this triggers a fetch
    setInput((prevInput) => ({
      ...resetCursors(prevInput, pagination.pageSize),
      filter: {
        ...prevInput.filter,
        ...newFilters,
      },
      searchTerm: newFilters.searchTerm ?? prevInput.searchTerm,
    }));
    // other handling logic
    setRowSelection({});
  };

  const totalRowCount = data?.totalCount ?? 0;
  const pageInfo = data?.pageInfo;

  const onPreviousPage = (): void => {
    if (pageInfo && pageInfo.hasPreviousPage) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex - 1,
      }));
      // trigger a fetch with the new pagination state
      setInput((prevInput) => ({
        ...prevInput,
        before: pageInfo?.startCursor,
        last: pagination.pageSize,
        first: null,
        after: null,
      }));
    }
  };

  const onNextPage = (): void => {
    if (pageInfo && pageInfo.hasNextPage) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
      // trigger a fetch with the new pagination state
      setInput((prevInput) => ({
        ...prevInput,
        first: pagination.pageSize,
        after: pageInfo?.endCursor,
        last: null,
        before: null,
      }));
    }
  };

  const onReset = (newPageSize: number): void => {
    setPagination({ pageSize: newPageSize, pageIndex: 0 });
    setInput((prevInput) => ({
      ...prevInput,
      first: pageSize,
      after: null,
      last: null,
      before: null,
    }));
    updatePersonalization({ pageSize: newPageSize });
  };

  const handleSort = ({ field, direction }): void => {
    setSortingState({ field, direction });
    let orderBy;
    if (direction === SortDirection.DEFAULT) {
      orderBy = null;
    } else {
      orderBy = {
        field,
        direction: direction.toUpperCase(),
      };
    }

    setInput((prevInput) => ({
      ...resetCursors(prevInput, pagination.pageSize),
      orderBy,
    }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columnHelper = createMRTColumnHelper<Person>();

  console.log("styles import", styles);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        Header: ({ header }) => (
          <SortableHeaderCell
            id={header.id}
            sortingState={sortingState}
            onSort={handleSort}
            label="Name"
          />
        ),
        size: 150,
        enableCellHoverReveal: true,
      }),
      columnHelper.accessor("age", {
        header: "Age",
        Header: ({ header }) => (
          <SortableHeaderCell
            id={header.id}
            sortingState={sortingState}
            onSort={handleSort}
            label="Age"
          />
        ),
      }),
      columnHelper.accessor("city", { header: "City" }),
      columnHelper.accessor("appliedOn", {
        header: "Applied on",
      }),
    ],
    [sortingState],
  );

  const isTableEmpty = data?.nodes?.length === 0;

  const resetFilters = (): void => {
    setFilters({
      city: null,
      dateRange: null,
      searchTerm: "",
    });
    setInput((prevInput) => ({
      ...resetCursors(prevInput, pagination.pageSize),
      filter: {},
      searchTerm: "",
    }));
    setRowSelection({});
  };

  /* @compiler "use no memo" */
  const table = useMantineReactTable({
    columns,
    data: data?.nodes || [],
    initialState: {
      density,
    },
    state: {
      isLoading: isFetching || isLoading,
      showLoadingOverlay: isFetching || isLoading,
      rowSelection,
      density,
    },
    onRowSelectionChange: setRowSelection,
    mantineLoadingOverlayProps: { loaderProps: { color: "gray.6" } },
    manualPagination: true,
    enableExpanding: false,
    enableExpandAll: false,
    enableColumnFilters: false,
    enableSorting: false, // disabling sorting as we want to use a custom sorting function
    enableColumnActions: false,
    enableRowSelection: true,
    enableTopToolbar: true, // enable if you have a top toolbar containing table filters, otherwise set to false
    enableBottomToolbar: true,
    mantinePaperProps: { withBorder: true },
    mantineTableProps: {
      highlightOnHover: false,
      withTableBorder: false,
      withRowBorders: true,
    },
    enableStickyHeader: true, // enable if you want the table header to be sticky
    mantineTableContainerProps: {
      style: { maxHeight: "500px" },
      "aria-label": "data table",
      tabIndex: 0,
    },
    mantineTableHeadRowProps: {
      style: {
        boxShadow: "var(--mantine-shadow-xs)",
      },
    },
    mantineToolbarAlertBannerProps: {
      style: {
        "--text-color": "white",
      },
      p: "xs",
    },
    mantineTableBodyRowProps: {
      className: styles?.["table-row"],
      style: { ...(isTableEmpty ? { display: "grid" } : {}) }, // add if layoutMode is grid
    },
    icons: replacedIcons,
    layoutMode: "grid",
    localization: {
      toggleFullScreen: formatMessage({ id: "table.toggle.fullscreen" }),
      toggleDensity: formatMessage({ id: "table.toggle.density" }),
    },
    mantineSelectCheckboxProps: {
      size: "xs",
    },
    mantineSelectAllCheckboxProps: {
      size: "xs",
    },
    getRowId: (originalRow) => originalRow?.id?.toString(),
    renderToolbarAlertBannerContent: ({ table: tableInstance }) => (
      <CustomToolbarAlertBannerContent
        resetRowSelection={(): void => setRowSelection({})}
        numberOfSelectedRowsText={getNumberOfSelectedRowsText(
          tableInstance.getState().rowSelection,
        )}
        actions={[
          {
            label: "Delete",
            onClick: (): void =>
              console.log(
                `Deleting row ids: ${Object.keys(tableInstance.getState().rowSelection)}`,
              ),
            SVGIcon: <DeleteIcon style={{ width: rem(14), height: rem(14) }} />,
          },
        ]}
      />
    ),
    renderTopToolbar: () => (
      <CustomTopToolbar
        resultCount={totalRowCount}
        filtersState={filters}
        locale={locale}
        onChange={onFiltersChange}
        table={table}
        isLoading={isFetching || isLoading}
        showFilters={showFilters}
        numberOfSelectedRows={
          Object.keys(table.getState()?.rowSelection || {}).filter(
            (key) => table.getState()?.rowSelection[key],
          ).length || 0
        }
        onFilterToggleChange={(): void => {
          const newShowFilters = !showFilters;
          updatePersonalization({ showFilters: newShowFilters });
        }}
      />
    ),
    renderBottomToolbar: () => (
      <CustomBottomToolbar
        isDisabled={isError}
        paginationState={pagination}
        hasPreviousPage={pageInfo?.hasPreviousPage}
        hasNextPage={pageInfo?.hasNextPage}
        totalNumOfRows={totalRowCount}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onPageSizeChange={onReset}
        isFetching={isFetching}
        numberOfSelectedRowsText={getNumberOfSelectedRowsText(
          table.getState().rowSelection,
        )}
      />
    ),
    renderEmptyRowsFallback: () => (
      <ErrorOverlay
        title={
          isError
            ? formatMessage({ id: "table.overlay.error.state.title" })
            : formatMessage({ id: "table.overlay.empty.state.title" })
        }
        description={
          isError
            ? formatMessage({ id: "table.overlay.error.state.description" })
            : formatMessage({ id: "table.overlay.empty.state.description" })
        }
        SVGIcon={isError ? undefined : <SearchIcon />}
        props={{ my: "xl" }}
        actions={[
          {
            label: isError
              ? formatMessage({ id: "table.overlay.error.state.button" })
              : formatMessage({ id: "table.overlay.empty.state.button" }),
            onClick: isError ? refetch : resetFilters,
            buttonProps: { variant: "default" },
          },
        ]}
      />
    ),
    onDensityChange: (densityUpdater) => {
      const newDensity =
        typeof densityUpdater === "function"
          ? densityUpdater(densityRef.current)
          : densityUpdater;
      updatePersonalization({ density: newDensity });
      densityRef.current = newDensity;
    },
  });

  return <MantineReactTable table={table} />;
};

export default Table;
