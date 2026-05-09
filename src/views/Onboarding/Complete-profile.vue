<template>
  <div class="fixed z-9999 top-0 left-0 w-fit h-6 m-4">
    <RouterLink to="/">
      <appLogo class="h-full" />
    </RouterLink>
  </div>
  <main class="w-full md:pt-[10%] pt-[15%] px-4 sm:max-w-[400px] mx-auto">
    <div class="w-full h-full flex flex-col gap-8">
      <div class="w-full flex flex-col gap-1 text-center">
        <h1 class="text-black text-2xl font-semibold">Completa il tuo profilo</h1>
      </div>
      <form @submit.prevent class="w-full flex flex-col">
        <div class="w-full flex flex-col gap-2">
          <tlInput
            v-model="data.user.first_name"
            forLabel="first_name"
            type="text"
            label="Nome"
            :error="data.error.first_name"
            :disabled="data.loading"
          />
          <tlInput
            v-model="data.user.last_name"
            forLabel="last_name"
            type="text"
            label="Cognome"
            :error="data.error.last_name"
            :disabled="data.loading"
          />
        </div>
        <tlButton
          @click="actionCompleteProfile"
          type="submit"
          label="Continua"
          :loading="data.loading"
          :disabled="!data.user.first_name || !data.user.last_name"
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
import { toast } from '../../utils/toast';

import appLogo from '../../components/global/app-logo.vue';
import tlInput from '../../components/input/tl-input.vue';
import tlButton from '../../components/button/tl-button.vue';

export default {
  name: 'Complete-profile',
  components: {
    appLogo,
    tlInput,
    tlButton,
  },
  data() {
    return {
      auth,
      data: {
        user: {
          first_name: '',
          last_name: '',
        },
        error: {
          first_name: null,
          last_name: null,
          general: null,
        },
        loading: false,
      },
    };
  },
  methods: {
    async actionCompleteProfile() {
      if (!this.auth.profile) return;

      const profileId = this.auth.profile.id;

      if (!this.data.user.first_name) {
        this.data.error.first_name = 'Campo obbligatorio';
        return;
      }

      if (!this.data.user.last_name) {
        this.data.error.last_name = 'Campo obbligatorio';
        return;
      }

      this.data.loading = true;

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ first_name: this.data.user.first_name, last_name: this.data.user.last_name })
          .eq('id', profileId);

        if (error) throw error;

        await getProfile();

        this.$router.push({ name: 'home' });

        toast.dark('Completato!', { showIcon: false, closable: false });
      } catch (e) {
        console.error(e);
      } finally {
        this.data.loading = false;
      }
    },
  },
  mounted() {
    if (this.auth.profile) {
      this.data.user.first_name = this.auth.profile?.first_name;
      this.data.user.last_name = this.auth.profile?.last_name;
    }
  },
};
</script>

<style scoped></style>
