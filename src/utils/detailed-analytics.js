/**
 * Calcola i dati per il grafico dei ricavi mensili
 * @param {Array} invoices - Lista delle fatture
 * @returns {Object} - Dati formattati per Chart.js
 */
export function getMonthlyRevenueData(invoices) {
  if (!invoices || invoices.length === 0) return { labels: [], datasets: [] };

  const monthlyData = {};
  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  // Inizializza gli ultimi 6 mesi
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyData[key] = 0;
  }

  invoices.forEach((invoice) => {
    const date = new Date(invoice.invoice_date);
    const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    if (key in monthlyData) {
      monthlyData[key] += parseFloat(invoice.amount) || 0;
    }
  });

  return {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Ricavi (€)',
        data: Object.values(monthlyData),
        backgroundColor: '#000000',
        borderRadius: 10,
      },
    ],
  };
}

/**
 * Calcola la distribuzione degli stati delle fatture
 * @param {Array} invoices - Lista delle fatture
 * @returns {Object} - Dati formattati per Chart.js
 */
export function getInvoiceStatusDistribution(invoices) {
  if (!invoices || invoices.length === 0) return { labels: [], datasets: [] };

  const statusCounts = {
    paid: 0,
    pending: 0,
    overdue: 0,
  };

  invoices.forEach((invoice) => {
    const status = invoice.status || 'pending';
    if (status in statusCounts) {
      statusCounts[status]++;
    } else {
      statusCounts.pending++;
    }
  });

  return {
    labels: ['Pagate', 'In attesa', 'Scadute'],
    datasets: [
      {
        data: [statusCounts.paid, statusCounts.pending, statusCounts.overdue],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderWidth: 3,
        borderRadius: 50,
        rotation: 180,
      },
    ],
  };
}

/**
 * Calcola i top client per volume d'affari
 * @param {Array} invoices - Lista delle fatture
 * @returns {Object} - Dati formattati per Chart.js
 */
export function getTopClientsData(invoices) {
  if (!invoices || invoices.length === 0) return { labels: [], datasets: [] };

  const clientTotals = {};

  invoices.forEach((invoice) => {
    const clientName = invoice.supplier_name || 'Sconosciuto';
    clientTotals[clientName] = (clientTotals[clientName] || 0) + (parseFloat(invoice.amount) || 0);
  });

  const sortedClients = Object.entries(clientTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    labels: sortedClients.map(([name]) => name),
    datasets: [
      {
        label: 'Volume affari (€)',
        data: sortedClients.map(([, total]) => total),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };
}
