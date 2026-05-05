/**
 * Calcola il numero totale di fatture
 * @param {Array} invoices - Lista delle fatture
 * @returns {number}
 */
export function getTotalInvoicesCount(invoices) {
  if (!invoices) return 0;
  return invoices.length;
}

/**
 * Calcola l'importo totale di tutte le fatture
 * @param {Array} invoices - Lista delle fatture
 * @returns {number}
 */
export function getTotalInvoicesAmount(invoices) {
  if (!invoices) return 0;
  return invoices.reduce((acc, invoice) => acc + (parseFloat(invoice.amount) || 0), 0);
}

/**
 * Calcola l'importo totale delle fatture pagate
 * @param {Array} invoices - Lista delle fatture
 * @returns {number}
 */
export function getPaidInvoicesAmount(invoices) {
  if (!invoices) return 0;
  return invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((acc, invoice) => acc + (parseFloat(invoice.amount) || 0), 0);
}

/**
 * Calcola l'importo totale delle fatture in attesa o scadute
 * @param {Array} invoices - Lista delle fatture
 * @returns {number}
 */
export function getPendingInvoicesAmount(invoices) {
  if (!invoices) return 0;
  return invoices
    .filter((invoice) => invoice.status === 'pending' || invoice.status === 'overdue' || !invoice.status)
    .reduce((acc, invoice) => acc + (parseFloat(invoice.amount) || 0), 0);
}

/**
 * Calcola il numero di fornitori unici
 * @param {Array} invoices - Lista delle fatture
 * @returns {number}
 */
export function getUniqueSuppliersCount(invoices) {
  if (!invoices) return 0;
  const suppliers = new Set(invoices.map((invoice) => invoice.supplier_name).filter(Boolean));
  return suppliers.size;
}
