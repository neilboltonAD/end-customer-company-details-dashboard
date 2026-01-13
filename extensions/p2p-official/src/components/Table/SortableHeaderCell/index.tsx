import React, { type ReactElement } from "react";
import { Flex, rem } from "@mantine/core";
import SortAscIcon from "remixicon/icons/Editor/sort-asc.svg";
import SortDescIcon from "remixicon/icons/Editor/sort-desc.svg";
import UpDownIcon from "remixicon/icons/Arrows/arrow-up-down-line.svg";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
  DEFAULT = "default",
}

const iconSize = {
  width: rem(12),
  height: rem(12),
};

const iconDirectionMap = {
  [SortDirection.ASC]: (
    <SortAscIcon
      style={{ color: "var(--mantine-color-blue-filled)", ...iconSize }}
    />
  ),
  [SortDirection.DESC]: (
    <SortDescIcon
      style={{ color: "var(--mantine-color-blue-filled)", ...iconSize }}
    />
  ),
  [SortDirection.DEFAULT]: (
    <UpDownIcon data-testid="default-sort-icon" style={iconSize} />
  ),
};

interface SortableHeaderCellProps {
  id: string;
  label: string;
  sortingState: { direction: SortDirection; field?: string };
  onSort: (sortingState: { direction: SortDirection; field: string }) => void;
}

const SortableHeaderCell = ({
  id,
  label,
  sortingState,
  onSort,
}: SortableHeaderCellProps): ReactElement => {
  const sortDirection =
    sortingState.field === id ? sortingState.direction : SortDirection.DEFAULT;

  const onSortClick = (): void => {
    let newSortDirection;
    if (sortDirection === SortDirection.DEFAULT) {
      newSortDirection = SortDirection.ASC;
    } else if (sortDirection === SortDirection.ASC) {
      newSortDirection = SortDirection.DESC;
    } else {
      newSortDirection = SortDirection.DEFAULT;
    }
    onSort({ direction: newSortDirection, field: id });
  };

  return (
    <Flex
      style={{ cursor: "pointer" }}
      align="center"
      justify="center"
      gap="xs"
      onClick={onSortClick}
    >
      {label}
      {iconDirectionMap[sortDirection]}
    </Flex>
  );
};

export default SortableHeaderCell;
