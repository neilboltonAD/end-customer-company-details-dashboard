export enum Preset {
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  CUSTOM = "custom",
}

export const getPresets = (
  formatMessage: (descriptor: { id: string }) => string,
): { label: string; value: Preset }[] => [
  {
    label: formatMessage({ id: "table.filters.date.range.week" }),
    value: Preset.WEEK,
  },
  {
    label: formatMessage({ id: "table.filters.date.range.month" }),
    value: Preset.MONTH,
  },
  {
    label: formatMessage({ id: "table.filters.date.range.quarter" }),
    value: Preset.QUARTER,
  },
  {
    label: formatMessage({ id: "table.filters.date.range.custom" }),
    value: Preset.CUSTOM,
  },
];

export const getPresetLabel = (
  value: string,
  formatMessage: (descriptor: { id: string }) => string,
): string => {
  return (
    getPresets(formatMessage).find((item) => item.value === value)?.label || ""
  );
};

export const getDateRangeFromPreset = (
  preset: string,
): [Date | null, Date | null] | null => {
  const now = new Date();
  const start = new Date();
  switch (preset) {
    case Preset.WEEK:
      start.setDate(now.getDate() - 7);
      break;
    case Preset.MONTH:
      start.setMonth(now.getMonth() - 1);
      break;
    case Preset.QUARTER:
      start.setMonth(now.getMonth() - 3);
      break;
    default:
      return null;
  }
  return [start, now];
};
