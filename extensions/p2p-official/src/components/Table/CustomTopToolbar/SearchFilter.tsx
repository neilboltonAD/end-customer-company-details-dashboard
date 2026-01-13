import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import SearchIcon from "remixicon/icons/System/search-line.svg";
import CloseIcon from "remixicon/icons/System/close-line.svg";
import { rem, TextInput } from "@mantine/core";

const debounce = (
  fn: (value: string) => void,
  timeout = 1000,
): ((value: string) => void) => {
  let timer: NodeJS.Timeout | undefined;
  return (value: string): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(value), timeout);
  };
};

interface SearchFilterProps {
  searchTerm: string;
  onChange: (value: string) => void;
}

const SearchFilter = ({
  searchTerm,
  onChange,
}: SearchFilterProps): ReactElement => {
  const { formatMessage } = useIntl();
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);

  const debouncedSearch = useRef(
    debounce((value) => {
      onChange(value);
    }, 300),
  ).current;

  const handleSearchChange = (value: string): void => {
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const clearSearch = (): void => {
    setLocalSearchTerm("");
    onChange("");
  };

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <TextInput
      size="xs"
      placeholder={formatMessage({ id: "table.search.placeholder" })}
      style={{ flexGrow: "1" }}
      onChange={(event): void => handleSearchChange(event.target.value)}
      rightSection={
        localSearchTerm === "" ? (
          <SearchIcon style={{ width: rem(14), height: rem(14) }} />
        ) : (
          <CloseIcon
            data-testid="search-clear"
            onClick={clearSearch}
            style={{ width: rem(14), height: rem(14), cursor: "pointer" }}
          />
        )
      }
      value={localSearchTerm}
      styles={{
        wrapper: {
          fontSize: "var(--mantine-font-size-xs)",
        },
      }}
    />
  );
};

export default SearchFilter;
