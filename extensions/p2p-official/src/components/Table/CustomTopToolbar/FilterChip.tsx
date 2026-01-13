import React from "react";
import { Chip, rem } from "@mantine/core";
import CloseIcon from "remixicon/icons/System/close-line.svg";

interface FilterChipProps {
  label: string;
  onClick: () => void;
}

const FilterChip = ({ label, onClick }: FilterChipProps): JSX.Element => {
  return (
    <Chip
      color="gray.3"
      size="xs"
      icon={<CloseIcon style={{ width: rem(10), height: rem(10) }} />}
      variant="outline"
      checked
      onChange={onClick}
    >
      {label}
    </Chip>
  );
};

export default FilterChip;
