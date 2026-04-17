export function formatPercent(value?: number | null) {
  if (value === null || value === undefined) return "N/A";
  return `${Math.round(value * 100)}%`;
}

export function formatDate(value?: string | null) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

