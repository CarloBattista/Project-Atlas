import { supabase } from './supabase';
import { auth } from '../data/auth';

function clearAuth() {
  auth.user = null;
  auth.session = null;
  auth.profile = null;
  auth.isAuthenticated = false;
  auth.userLoading = false;
  auth.profileLoading = false;
  localStorage.removeItem('isAuthenticated');
}

export async function getAuthUser() {
  auth.userLoading = true;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      clearAuth();
      return;
    }

    if (data?.user) {
      auth.user = data.user;
      auth.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
      await getSession();
      await getProfile();
    } else {
      clearAuth();
    }
  } catch (e) {
    console.error(e);
    clearAuth();
  } finally {
    auth.userLoading = false;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    auth.session = data.session;
  } catch (e) {
    console.error(e);
    clearAuth();
  }
}

export async function getProfile() {
  if (!auth.user) return;

  const userId = auth.user.id;

  auth.profileLoading = true;

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (error) throw error;

    auth.profile = data;
  } catch (e) {
    console.error(e);
  } finally {
    auth.profileLoading = false;
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    clearAuth();

    window.location.href = '/signin';
  } catch (e) {
    console.error(e);
  }
}
