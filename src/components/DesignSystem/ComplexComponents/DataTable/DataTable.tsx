import React, { useMemo, useState } from 'react';
import { ActionIcon, Box, Group, Loader, ScrollArea, Table, Text, TextInput } from '@mantine/core';
import { RiArrowDownSLine, RiArrowUpSLine, RiSearchLine } from '@remixicon/react';

export type SortDirection = 'asc' | 'desc' | null;

export type DataTableColumn<T> = {
  accessorKey: keyof T | string;
  header: React.ReactNode;
  size?: number;
  enableSorting?: boolean;
  cell?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
};

// Back-compat types from the reference implementation.
export type DateRange = [Date | null, Date | null];
export type City = string;
export type Filters = Record<string, unknown>;

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumn<T>[];

  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  onRetry?: () => void;

  showSearch?: boolean;
  searchPlaceholder?: string;

  onSortChange?: (field: string, direction: SortDirection) => void;
  defaultSortField?: string;
  defaultSortDirection?: Exclude<SortDirection, null>;

  getRowId?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;

  minWidth?: number;
  emptyMessage?: string;
}

function getValue(row: any, key: string) {
  return row?.[key];
}

function compare(a: any, b: any) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  isError,
  error,
  onRetry,
  showSearch = true,
  searchPlaceholder = 'Search',
  onSortChange,
  defaultSortField,
  defaultSortDirection = 'asc',
  getRowId,
  onRowClick,
  minWidth = 900,
  emptyMessage = 'No results',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(defaultSortField || null);
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSortField ? defaultSortDirection : null);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!showSearch || !normalizedQuery) return data;
    return data.filter((row) =>
      columns.some((c) => {
        const k = String(c.accessorKey);
        const v = c.cell ? c.cell(row) : getValue(row, k);
        if (typeof v === 'string' || typeof v === 'number') {
          return String(v).toLowerCase().includes(normalizedQuery);
        }
        const raw = getValue(row, k);
        return (typeof raw === 'string' || typeof raw === 'number') && String(raw).toLowerCase().includes(normalizedQuery);
      })
    );
  }, [columns, data, normalizedQuery, showSearch]);

  const sorted = useMemo(() => {
    if (!sortField || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((ra, rb) => {
      const a = getValue(ra, sortField);
      const b = getValue(rb, sortField);
      const d = compare(a, b);
      return sortDir === 'asc' ? d : -d;
    });
    return arr;
  }, [filtered, sortDir, sortField]);

  const toggleSort = (field: string, sortable?: boolean) => {
    if (!sortable) return;

    setSortField((prevField) => {
      if (prevField !== field) {
        setSortDir('asc');
        onSortChange?.(field, 'asc');
        return field;
      }

      setSortDir((prevDir) => {
        const next: SortDirection = prevDir === 'asc' ? 'desc' : prevDir === 'desc' ? null : 'asc';
        onSortChange?.(field, next);
        return next;
      });
      return prevField;
    });
  };

  return (
    <Box>
      {showSearch && (
        <Group justify="space-between" mb="sm">
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder={searchPlaceholder}
            leftSection={<RiSearchLine size={16} />}
            w={320}
          />
        </Group>
      )}

      {isError && (
        <Group justify="space-between" mb="sm">
          <Text c="red" size="sm">
            {error || 'Failed to load table data.'}
          </Text>
          {onRetry && (
            <ActionIcon variant="light" onClick={onRetry} aria-label="Retry">
              ↻
            </ActionIcon>
          )}
        </Group>
      )}

      <ScrollArea type="auto" offsetScrollbars>
        <Table highlightOnHover withTableBorder miw={minWidth}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((c) => {
                const field = String(c.accessorKey);
                const isActive = sortField === field && sortDir;
                return (
                  <Table.Th
                    key={field}
                    style={{
                      width: c.size,
                      cursor: c.enableSorting ? 'pointer' : undefined,
                      userSelect: 'none',
                      textAlign: c.align,
                    }}
                    onClick={() => toggleSort(field, c.enableSorting)}
                  >
                    <Group gap={6} wrap="nowrap">
                      <Text size="sm" fw={700}>
                        {c.header}
                      </Text>
                      {c.enableSorting && (
                        <span style={{ display: 'inline-flex', opacity: isActive ? 1 : 0.35 }}>
                          {isActive && sortDir === 'desc' ? <RiArrowDownSLine size={16} /> : <RiArrowUpSLine size={16} />}
                        </span>
                      )}
                    </Group>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Group justify="center" py="xl">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">
                      Loading…
                    </Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ) : sorted.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Group justify="center" py="xl">
                    <Text size="sm" c="dimmed">
                      {emptyMessage}
                    </Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ) : (
              sorted.map((row, idx) => {
                const id = getRowId ? getRowId(row, idx) : String((row as any).id || idx);
                return (
                  <Table.Tr
                    key={id}
                    style={{ cursor: onRowClick ? 'pointer' : undefined }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((c) => {
                      const field = String(c.accessorKey);
                      const v = c.cell ? c.cell(row) : getValue(row, field);
                      return (
                        <Table.Td key={`${id}:${field}`} style={{ textAlign: c.align }}>
                          {typeof v === 'string' || typeof v === 'number' ? <Text size="sm">{String(v)}</Text> : v}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}

