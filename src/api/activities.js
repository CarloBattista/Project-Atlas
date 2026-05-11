import { supabase } from '../lib/supabase';
import { auth } from '../data/auth';
import { datadb } from '../data/datadb';

export async function getClientActivities(clientId, page = 1, limit = 5) {
  if (!clientId) return;

  const profileId = auth.profile?.id;
  if (!profileId) return;

  datadb.activities.loading = true;
  datadb.activities.error = null;

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('activities')
      .select('*', { count: 'exact' })
      .eq('profile_id', profileId)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    if (page === 1) {
      datadb.activities.data = data || [];
    } else {
      datadb.activities.data = [...(datadb.activities.data || []), ...(data || [])];
    }

    datadb.activities.hasMore = datadb.activities.data.length < (count || 0);
  } catch (e) {
    console.error(e);
    datadb.activities.error = e.message;
  } finally {
    datadb.activities.loading = false;
  }
}
