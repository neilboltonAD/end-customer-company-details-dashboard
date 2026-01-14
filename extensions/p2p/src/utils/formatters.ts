export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatTermDuration(term: string): string {
  switch (term) {
    case 'P1M': return 'Monthly';
    case 'P1Y': return 'Annual';
    case 'P3Y': return 'Triennial';
    default: return term;
  }
}

export function formatBillingCycle(cycle: string): string {
  switch (cycle) {
    case 'Monthly': return 'Monthly';
    case 'Annual': return 'Paid Annually';
    case 'Triennial': return 'Paid Triennially';
    default: return cycle;
  }
}


