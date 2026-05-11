export function getInvoiceStatusVariant(status) {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    case 'overdue':
      return 'danger';
    default:
      return 'danger';
  }
}

export function getInvoiceStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'In attesa';
    case 'paid':
      return 'Pagata';
    case 'overdue':
      return 'Scaduta';
    default:
      return 'Non pagata';
  }
}

export function getClientStatusVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'warning';
    case 'blocked':
      return 'danger';
    default:
      return 'danger';
  }
}

export function getClientStatusLabel(status) {
  switch (status) {
    case 'active':
      return 'Attivo';
    case 'inactive':
      return 'Inattivo';
    case 'blocked':
      return 'Bloccato';
    default:
      return 'Non valido';
  }
}

export function formatDate(date, options = {}) {
  const { includeTime = false } = options;

  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d)) return '';

  const dateOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }

  const parts = new Intl.DateTimeFormat('it-IT', dateOptions).formatToParts(d);

  const day = parts.find((p) => p.type === 'day')?.value;
  let month = parts.find((p) => p.type === 'month')?.value;
  const year = parts.find((p) => p.type === 'year')?.value;
  const hour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;

  month = month.charAt(0).toUpperCase() + month.slice(1);

  let formatted = `${day} ${month}, ${year}`;

  if (includeTime && hour && minute) {
    formatted += ` alle ${hour}:${minute}`;
  }

  return formatted;
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';

  const value = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(value)) return '';

  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
