<template>
  <div class="fixed z-9999 top-0 left-0 w-fit h-6 m-4">
    <RouterLink to="/">
      <appLogo class="h-full" />
    </RouterLink>
  </div>
  <main class="w-full md:pt-[10%] pt-[15%] px-4 sm:max-w-[400px] mx-auto">
    <div class="w-full h-full flex flex-col gap-8">
      <div class="w-full flex flex-col gap-1 text-center">
        <h1 class="text-black text-2xl font-semibold">Ti diamo il benvenuto su Atlas</h1>
        <p class="text-gray-500 text-base font-normal">Registrati per iniziare.</p>
      </div>
      <form @submit.prevent class="w-full flex flex-col">
        <div class="w-full flex flex-col gap-2">
          <tlInput v-model="data.user.email" forLabel="email_address" type="email" label="Email" :error="data.error.email" :disabled="data.loading" />
          <tlInput
            v-model="data.user.password"
            forLabel="password"
            type="password"
            label="Password"
            :error="data.error.password"
            :disabled="data.loading"
          />
          <tlInput
            v-model="data.user.confirm_password"
            forLabel="confirm_password"
            type="password"
            label="Conferma password"
            :error="data.error.confirm_password"
            :disabled="data.loading"
          />
          <p class="text-gray-500 text-sm font-normal self-end">
            Hai già un account? <RouterLink to="/signin" class="text-black font-medium">Accedi qui</RouterLink>
          </p>
        </div>
        <tlButton
          @click="actionSignup"
          type="submit"
          label="Continua"
          :loading="data.loading"
          :disabled="!data.user.email || !data.user.password || !data.user.confirm_password"
          class="mt-6"
        />
      </form>
    </div>
  </main>
</template>

<script>
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import { getProfile } from '../../lib/auth';

import appLogo from '../../components/global/app-logo.vue';
import tlInput from '../../components/input/tl-input.vue';
import tlButton from '../../components/button/tl-button.vue';

export default {
  name: 'Signup',
  components: {
    appLogo,
    tlInput,
    tlButton,
  },
  data() {
    return {
      data: {
        user: {
          email: 'carlo@gmail.com',
          password: 'carlo1234',
          confirm_password: 'carlo1234',
        },
        error: {
          email: null,
          password: null,
          confirm_password: null,
          general: null,
        },
        loading: false,
      },
    };
  },
  methods: {
    async actionSignup() {
      if (!this.data.user.email) {
        this.data.error.email = 'Campo obbligatorio';
        return;
      }

      if (!this.data.user.password) {
        this.data.error.password = 'Campo obbligatorio';
        return;
      }

      if (!this.data.user.confirm_password) {
        this.data.error.confirm_password = 'Campo obbligatorio';
        return;
      } else if (this.data.user.password !== this.data.user.confirm_password) {
        this.data.error.confirm_password = 'Le password non coincidono';
        return;
      }

      this.data.loading = true;

      try {
        const { data, error } = await supabase.auth.signUp({
          email: this.data.user.email,
          password: this.data.user.password,
        });

        if (error) throw error;

        auth.user = data.user;
        auth.session = data.session;
        auth.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', true);

        await getProfile();

        this.$router.push({ name: 'confirm-email' });
      } catch (e) {
        console.error(e);
      } finally {
        this.data.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
