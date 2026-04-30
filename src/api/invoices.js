import { supabase } from '../lib/supabase';
import { datadb } from '../data/datadb';

export async function getInvoices() {
  datadb.invoices.loading = true;
  datadb.invoices.error = null;
  datadb.invoices.data = [];

  try {
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });

    if (error) throw error;

    datadb.invoices.data = data || [];
  } catch (e) {
    console.error(e);
    datadb.invoices.error = e.message;
  } finally {
    datadb.invoices.loading = false;
  }
}

export async function getInvoiceById(invoiceId) {
  if (!invoiceId) return;

  datadb.invoice.loading = true;
  datadb.invoice.error = null;
  datadb.invoice.data = null;

  try {
    const { data, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).single();

    if (error) throw error;

    datadb.invoice.data = data;
  } catch (e) {
    console.error(e);
    datadb.invoice.error = e.message;
  } finally {
    datadb.invoice.loading = false;
  }
}
