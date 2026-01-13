import React, { ReactElement, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  ActionIcon,
  Group,
  Indicator,
  Stack,
  Text,
  SimpleGrid,
  rem,
} from "@mantine/core";
import { DatesRangeValue } from "@mantine/dates";
import FilterIcon from "remixicon/icons/System/filter-line.svg";
import {
  MRT_TableInstance as MRTTableInstance,
  MRT_ToggleFullScreenButton as MRTToggleFullScreenButton,
  MRT_ToggleDensePaddingButton as MRTToggleDensePaddingButton,
  MRT_ToolbarAlertBanner as BaseMRTToolbarAlertBanner,
} from "mantine-react-table-open";
import SelectFilter from "./SelectFilter";
import SearchFilter from "./SearchFilter";
import DateRangeSelector from "./DateRangeSelectorFilter";
import FilterChip from "./FilterChip";
import { Person } from "../useFetchMockData";
import ResultCount from "./ResultCount";

enum City {
  NEW_YORK = "New York",
  LOS_ANGELES = "Los Angeles",
  DENVER = "Denver",
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface Filters {
  city?: City | null;
  dateRange?: DateRange | null;
  searchTerm?: string;
}

export interface CustomTopToolbarProps {
  filtersState: Filters;
  locale: string;
  onChange: (filters: Filters) => void;
  resultCount: number;
  numberOfSelectedRows: number;
  table: MRTTableInstance<Person>;
  isLoading?: boolean;
  onFilterToggleChange: () => void;
  showFilters: boolean;
}

interface ExtendedAlertBannerProps {
  stackAlertBanner?: boolean;
  table: MRTTableInstance<Person>;
  bg?: string;
  numberofselectedrows: number;
}

const MRTToolbarAlertBanner =
  BaseMRTToolbarAlertBanner as React.ComponentType<ExtendedAlertBannerProps>;

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const FilterIconButton = ({
  onClick,
  areFiltersShown,
  formatMessage,
}: {
  onClick: () => void;
  areFiltersShown: boolean;
  formatMessage: (descriptor: { id: string }) => string;
}): ReactElement => (
  <ActionIcon
    data-testid="additional-filter-toggle"
    variant={areFiltersShown ? "outline" : "default"}
    onClick={onClick}
    aria-label={formatMessage({ id: "table.filters.toggle.aria" })}
  >
    <FilterIcon color="black" style={{ width: "71%", height: "71%" }} />
  </ActionIcon>
);

const CustomTopToolbar = ({
  filtersState,
  locale,
  resultCount,
  onChange,
  table,
  numberOfSelectedRows,
  isLoading,
  showFilters,
  onFilterToggleChange,
}: CustomTopToolbarProps): ReactElement => {
  const { formatMessage } = useIntl();
  const { searchTerm, city, dateRange } = filtersState;
  const [dateRangeSelectorRefreshKey, setDateRangeSelectorRefreshKey] =
    useState<number>(0);

  const normalizeDateValue = (date: DatesRangeValue[number]): Date | null => {
    if (!date) {
      return null;
    }
    return typeof date === "string" ? new Date(date) : date;
  };

  useEffect(() => {
    if (dateRange === null) {
      setDateRangeSelectorRefreshKey((prev) => prev + 1);
    }
  }, [dateRange]);

  const handleDateChange = (value: DatesRangeValue | null): void => {
    function isOnlyOneDateSelected(): boolean {
      return !!(value && (value[0] === null || value[1] === null));
    }

    function areBothDatesSelected(): boolean {
      return !!(value && value[0] !== null && value[1] !== null);
    }

    if (isOnlyOneDateSelected()) {
      return;
    }
    let range: DateRange | null = null;

    if (value !== null && areBothDatesSelected()) {
      const startDate = normalizeDateValue(value[0]);
      const rawEndDate = normalizeDateValue(value[1]);

      if (startDate && rawEndDate) {
        const startOfDayUTC = new Date(
          Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
          ),
        );
        const endOfDayUTC = new Date(
          Date.UTC(
            rawEndDate.getUTCFullYear(),
            rawEndDate.getUTCMonth(),
            rawEndDate.getUTCDate(),
            23,
            59,
            59,
            999,
          ),
        );

        range = {
          start: startOfDayUTC,
          end: endOfDayUTC,
        };
      }
    }
    onChange({
      dateRange: range,
    });
  };

  const areFiltersActive = (): boolean => city !== null || dateRange !== null;

  const onToggleFilterClick = (): void => onFilterToggleChange();

  const clearFilters = (): void => {
    onChange({
      searchTerm,
      city: null,
      dateRange: null,
    });
    setDateRangeSelectorRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Stack
        p="md"
        gap="xshalf"
        style={{
          borderBottom: "1px solid var(--mantine-color-gray-3)",
        }}
      >
        <SimpleGrid cols={2}>
          <Group gap="xs" align="center">
            {areFiltersActive() ? (
              <Indicator size="8">
                <FilterIconButton
                  areFiltersShown={showFilters}
                  onClick={onToggleFilterClick}
                  formatMessage={formatMessage}
                />
              </Indicator>
            ) : (
              <FilterIconButton
                areFiltersShown={showFilters}
                onClick={onToggleFilterClick}
                formatMessage={formatMessage}
              />
            )}
            <SearchFilter
              searchTerm={searchTerm as string}
              onChange={(value): void =>
                onChange({
                  searchTerm: value,
                })
              }
            />
          </Group>
          <Group justify="end" gap="xs">
            <MRTToggleFullScreenButton
              size={rem(30)}
              variant="outline"
              table={table}
            />
            <MRTToggleDensePaddingButton
              size={rem(30)}
              variant="outline"
              table={table}
              data-testid="toggle-dense-padding"
            />
          </Group>
        </SimpleGrid>
        <Group justify="space-between">
          <Group gap="xs">
            {areFiltersActive() && (
              <>
                <Text
                  size="xs"
                  span
                  role="button"
                  fw={600}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={clearFilters}
                  c="blue"
                  data-testid="clear-filters"
                >
                  {formatMessage({ id: "table.filters.clear.filters" })}
                </Text>
                {filtersState.city && (
                  <FilterChip
                    label={filtersState.city}
                    onClick={(): void =>
                      onChange({
                        city: null,
                      })
                    }
                  />
                )}
                {filtersState.dateRange && (
                  <FilterChip
                    label={formatMessage(
                      { id: "table.filters.chip.date.range.label" },
                      {
                        startDate:
                          filtersState.dateRange.start?.toLocaleDateString(
                            undefined,
                            dateOptions,
                          ),
                        endDate: filtersState.dateRange.end?.toLocaleDateString(
                          undefined,
                          dateOptions,
                        ),
                      },
                    )}
                    onClick={(): void =>
                      onChange({
                        dateRange: null,
                      })
                    }
                  />
                )}
              </>
            )}
            <ResultCount resultCount={resultCount} isLoading={isLoading} />
          </Group>
        </Group>
        {showFilters && (
          <SimpleGrid
            data-testid="additional-filters"
            cols={3}
            spacing="xs"
            role="menu"
          >
            <DateRangeSelector
              key={dateRangeSelectorRefreshKey}
              label="Applied On"
              locale={locale}
              onChange={handleDateChange}
            />
            <SelectFilter
              label="City"
              onChange={(value): void => {
                onChange({
                  city: value as City | null,
                });
              }}
              selectedValue={city || null}
              data={[
                {
                  value: City.DENVER,
                  label: "Denver",
                },
                {
                  value: City.LOS_ANGELES,
                  label: "Los Angeles",
                },
                {
                  value: City.NEW_YORK,
                  label: "New York",
                },
              ]}
            />
          </SimpleGrid>
        )}
      </Stack>
      <MRTToolbarAlertBanner
        stackAlertBanner
        table={table}
        bg="blue"
        numberofselectedrows={numberOfSelectedRows}
      />
    </>
  );
};

export default CustomTopToolbar;
