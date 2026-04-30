import { supabase } from './supabase';
import { datadb } from '../data/datadb';

export async function getInvoices() {
  datadb.invoices.loading = true;

  try {
    const { data, error } = await supabase.from('invoices').select('*');

    if (error) throw error;

    datadb.invoices.data = data;
  } catch (e) {
    console.error(e);
    datadb.invoices.error = e;
  } finally {
    datadb.invoices.loading = false;
  }
}
