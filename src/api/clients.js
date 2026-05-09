import { supabase } from '../lib/supabase';
import { datadb } from '../data/datadb';

export async function getClients() {
  datadb.clients.loading = true;
  datadb.clients.error = null;
  datadb.clients.data = [];

  try {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });

    if (error) throw error;

    datadb.clients.data = data || [];
  } catch (e) {
    console.error(e);
    datadb.clients.error = e.message;
  } finally {
    datadb.clients.loading = false;
  }
}

export async function getClientById(clientId) {
  if (!clientId) return;

  datadb.client.loading = true;
  datadb.client.error = null;
  datadb.client.data = null;

  try {
    const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single();

    if (error) throw error;

    datadb.client.data = data;
  } catch (e) {
    console.error(e);
    datadb.client.error = e.message;
  } finally {
    datadb.client.loading = false;
  }
}

export async function createClient(clientData) {
  try {
    const { data, error } = await supabase.from('clients').insert([clientData]).select().single();

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function updateClient(clientId, updates) {
  if (!clientId) return;

  try {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', clientId).select().single();

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function deleteClientById(clientId) {
  if (!clientId) return;

  try {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);

    if (error) throw error;

    return { error: null };
  } catch (e) {
    console.error(e);
    return { error: e.message };
  }
}
