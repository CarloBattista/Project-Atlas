import { supabase } from '../lib/supabase';
import { datadb } from '../data/datadb';

export async function getInvoices(page = 1, limit = 10) {
  datadb.invoices.loading = true;
  datadb.invoices.error = null;

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('invoices')
      .select('*, clients(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    datadb.invoices.data = data || [];
    datadb.invoices.totalCount = count || 0;
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
    const { data, error } = await supabase.from('invoices').select('*, invoice_items(*)').eq('id', invoiceId).single();

    if (error) throw error;

    datadb.invoice.data = data;
  } catch (e) {
    console.error(e);
    datadb.invoice.error = e.message;
  } finally {
    datadb.invoice.loading = false;
  }
}

export async function createInvoice(invoiceData, items) {
  try {
    const { data, error } = await supabase.from('invoices').insert([invoiceData]).select().single();

    if (error) throw error;

    if (items && items.length > 0) {
      const itemsWithInvoiceId = items.map((item) => ({
        ...item,
        invoice_id: data.id,
      }));
      const { error: itemsError } = await supabase.from('invoice_items').insert(itemsWithInvoiceId);

      if (itemsError) throw itemsError;
    }

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function deleteInvoiceById(invoiceId) {
  if (!invoiceId) return;

  try {
    const { data, error } = await supabase.from('invoices').delete().eq('id', invoiceId);

    if (error) throw error;

    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

export async function markInvoiceAsPaidById(invoiceId) {
  if (!invoiceId) return;

  try {
    const { data, error } = await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId);

    if (error) throw error;

    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

export async function markInvoiceAsUnpaidById(invoiceId) {
  if (!invoiceId) return;

  try {
    const { data, error } = await supabase.from('invoices').update({ status: 'overdue' }).eq('id', invoiceId);

    if (error) throw error;

    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

export async function markInvoiceAsPendingById(invoiceId) {
  if (!invoiceId) return;

  try {
    const { data, error } = await supabase.from('invoices').update({ status: 'pending' }).eq('id', invoiceId);

    if (error) throw error;

    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

export async function updateInvoiceItem(itemId, updates) {
  if (!itemId) return;

  try {
    const { data, error } = await supabase.from('invoice_items').update(updates).eq('id', itemId);

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}
