import { supabase } from '../lib/supabase';

/**
 * Ricerca globale su Supabase per fatture e clienti
 * @param {string} query - La stringa di ricerca
 * @returns {Promise<{invoices: Array, clients: Array}>}
 */
export async function searchGlobal(query) {
  if (!query || query.length < 2) return { invoices: [], clients: [] };

  const searchPattern = `%${query}%`;

  try {
    // Ricerca fatture
    const { data: invoices, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .or(`supplier_name.ilike.${searchPattern},supplier_number.ilike.${searchPattern},notes.ilike.${searchPattern}`)
      .limit(5);

    if (invoiceError) throw invoiceError;

    // Ricerca clienti
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .or(
        `name.ilike.${searchPattern},email.ilike.${searchPattern},vat_number.ilike.${searchPattern},tax_code.ilike.${searchPattern},city.ilike.${searchPattern}`
      )
      .limit(5);

    if (clientError) throw clientError;

    return {
      invoices: invoices || [],
      clients: clients || [],
    };
  } catch (error) {
    console.error('Errore durante la ricerca globale:', error);
    return { invoices: [], clients: [] };
  }
}
