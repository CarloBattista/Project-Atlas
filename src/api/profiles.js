import { supabase } from '../lib/supabase';
import { auth } from '../data/auth';
import { store } from '../data/store';

export async function updateProfileName() {
  const profileId = auth.profile?.id;

  if (!profileId) return;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: store.modals.fullname.data.first_name,
        last_name: store.modals.fullname.data.last_name,
      })
      .eq('id', profileId);

    if (error) throw error;

    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
