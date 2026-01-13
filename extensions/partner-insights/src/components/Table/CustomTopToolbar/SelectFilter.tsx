import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { ComboboxData, Select } from "@mantine/core";

export interface SelectFilterProps {
  label: string;
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  data?: ComboboxData;
}

const SelectFilter = ({
  selectedValue,
  data,
  onChange,
  label,
}: SelectFilterProps): ReactElement => {
  const { formatMessage } = useIntl();

  return (
    <div role="menuitem">
      <Select
        data-testid="select-filter"
        clearable
        size="xs"
        label={label}
        placeholder={formatMessage({ id: "table.filters.show.all" })}
        data={data}
        onChange={(value): void => {
          onChange(value);
        }}
        styles={{
          wrapper: {
            fontSize: "var(--mantine-font-size-xs)",
          },
          label: {
            fontWeight: 600,
          },
        }}
        value={selectedValue}
      />
    </div>
  );
};

export default SelectFilter;
