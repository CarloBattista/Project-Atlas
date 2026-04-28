<template>
  <div></div>
</template>

<script>
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import { getProfile } from '../../lib/auth';

export default {
  name: 'Signin',
  data() {
    return {
      data: {
        user: {
          email: 'admin@gmail.com',
          password: 'admin',
        },
        error: {
          email: null,
          password: null,
          general: null,
        },
        loading: false,
      },
    };
  },
  methods: {
    async actionSignin() {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.data.user.email,
          password: this.data.user.password,
        });

        if (error) throw error;

        auth.user = data.user;
        auth.session = data.session;
        auth.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', true);

        await getProfile();

        this.$router.push({ name: 'home' });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped></style>
