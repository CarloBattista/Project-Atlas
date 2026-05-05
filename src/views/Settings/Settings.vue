<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 mb-8 flex items-center">
      <h1 class="text-black text-2xl font-semibold">Impoostazioni</h1>
    </div>
    <div class="w-full">
      <div class="w-full max-w-[560px] mx-auto flex flex-col gap-6">
        <div class="w-full flex flex-col">
          <div class="w-full h-10 px-3 flex items-center text-base font-medium">Account</div>
          <listContainer>
            <listItem @click="handleOpenFullnameModal" iconContext="UserRound" label="Nome" :rightLabel="labelFullname" />
            <listItem @click="handleOpenEmailModal" iconContext="Mail" label="Email" :rightLabel="labelEmail" />
            <listItem v-if="false" @click="handleOpenPhoneModal" iconContext="Smartphone" label="Numero di telefono" :rightLabel="labelPhone" />
          </listContainer>
        </div>
        <div class="w-full flex flex-col">
          <div class="w-full h-10 px-3 flex items-center text-base font-medium">Sicurezza</div>
          <listContainer>
            <listItem @click="handleOpenNotificationsModal" iconContext="Bell" label="Notifiche" />
            <listItem v-if="false" iconContext="MonitorSmartphone" label="Attività di accesso" />
          </listContainer>
        </div>
        <div class="w-full flex flex-col">
          <div class="w-full h-10 px-3 flex items-center text-base font-medium">Assistenza</div>
          <listContainer>
            <listItem iconContext="MessageCircleQuestionMark" label="Ricevi assistenza" rightIcon="SquareArrowOutUpRight" />
          </listContainer>
        </div>
        <div class="w-full flex gap-2 items-center">
          <tlButton @click="handleLogout" size="small" variant="tertiary" label="Esci" />
          <tlButton size="small" variant="link" label="Elimina account" style="color: #df1b42" />
        </div>
      </div>
    </div>
  </mainView>

  <modal modalKey="fullname" head="Aggiorna nome">
    <template #body>
      <div class="w-full flex gap-2 items-center">
        <tlInput
          v-model="store.modals.fullname.data.first_name"
          type="text"
          forLabel="firstName"
          label="Nome"
          :error="store.modals.fullname.errors.first_name"
          class="w-full"
        />
        <tlInput
          v-model="store.modals.fullname.data.last_name"
          type="text"
          forLabel="lastName"
          label="Cognome"
          :error="store.modals.fullname.errors.last_name"
          class="w-full"
        />
      </div>
    </template>
    <template #actions>
      <tlButton
        @click="handleUpdateFullname"
        size="small"
        label="Salva"
        :loading="store.modals.fullname.loading"
        :disabled="!store.modals.fullname.data.first_name && !store.modals.fullname.data.last_name"
      />
    </template>
  </modal>
  <modal modalKey="newEmail" head="Aggiorna email">
    <template #body>
      <div class="w-full flex gap-2 items-center">
        <tlInput
          v-model="store.modals.newEmail.data.email"
          type="text"
          forLabel="email"
          label="Email"
          :error="store.modals.newEmail.errors.email"
          class="w-full"
        />
      </div>
    </template>
    <template #actions>
      <tlButton
        @click="handleUpdateEmail"
        size="small"
        label="Salva"
        :loading="store.modals.newEmail.loading"
        :disabled="!store.modals.newEmail.data.email"
      />
    </template>
  </modal>
  <modal modalKey="phone" head="Aggiorna numero di telefono">
    <template #body>
      <div class="w-full flex gap-2 items-center">
        <tlInput
          v-model="store.modals.phone.data.phone"
          type="text"
          forLabel="phone"
          label="Numero di telefono"
          :error="store.modals.phone.errors.phone"
          class="w-full"
        />
      </div>
    </template>
    <template #actions>
      <tlButton
        @click="handleUpdatePhone"
        size="small"
        label="Salva"
        :loading="store.modals.phone.loading"
        :disabled="!store.modals.phone.data.phone"
      />
    </template>
  </modal>
  <modal modalKey="notifications" head="Notifiche" :actions="false">
    <template #body>
      <listContainer>
        <listItem type="big" label="Nuove fatture" description="Ricevi notifiche su nuove fatture" rightIcon="" :rightAction="true">
          <template #rightAction>
            <tlCheckbox />
          </template>
        </listItem>
        <listItem type="big" label="Nuovo cliente" description="Ricevi notifiche su nuovi clienti" rightIcon="" :rightAction="true">
          <template #rightAction>
            <tlCheckbox />
          </template>
        </listItem>
      </listContainer>
    </template>
  </modal>
</template>

<script>
import { auth } from '../../data/auth';
import { store } from '../../data/store';
import { getProfile, updateUserEmail, updateUserPhone, logout } from '../../lib/auth';
import { updateProfileName } from '../../api/profiles';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import modal from '../../components/modal/modal.vue';
import listContainer from '../../components/list/list-container.vue';
import listItem from '../../components/list/list-item.vue';
import tlButton from '../../components/button/tl-button.vue';
import tlInput from '../../components/input/tl-input.vue';
import tlCheckbox from '../../components/input/tl-checkbox.vue';

export default {
  name: 'Settings',
  components: {
    sidebar,
    mainView,
    modal,
    listContainer,
    listItem,
    tlButton,
    tlInput,
    tlCheckbox,
  },
  data() {
    return {
      auth,
      store,
    };
  },
  computed: {
    labelFullname() {
      if (!this.auth.profile) return;

      if (this.auth.profile?.first_name && this.auth.profile?.last_name) {
        return this.auth.profile?.first_name + ' ' + this.auth.profile?.last_name;
      }
      return 'Completa';
    },
    labelEmail() {
      if (!this.auth.user) return;

      if (this.auth.user?.email) {
        return this.auth.user?.email;
      }
      return 'Aggiungi';
    },
    labelPhone() {
      if (!this.auth.user) return;

      if (this.auth.user?.phone) {
        return this.auth.user?.phone;
      }
      return 'Aggiungi';
    },
  },
  methods: {
    handleOpenFullnameModal() {
      if (!this.auth.profile) return;

      this.store.modals.fullname.isOpen = true;
      this.store.modals.fullname.data.first_name = this.auth.profile?.first_name;
      this.store.modals.fullname.data.last_name = this.auth.profile?.last_name;
    },
    handleOpenEmailModal() {
      if (!this.auth.user) return;

      this.store.modals.newEmail.isOpen = true;
      this.store.modals.newEmail.data.email = this.auth.user?.email;
    },
    handleOpenPhoneModal() {
      return alert('Al momento non è possibile aggiornare il numero di telefono');

      //   if (!this.auth.user) return;

      //   this.store.modals.phone.isOpen = true;
      //   this.store.modals.phone.data.phone = this.auth.user?.phone;
    },
    handleOpenNotificationsModal() {
      this.store.modals.notifications.isOpen = true;
    },

    async handleUpdateFullname() {
      this.store.modals.fullname.loading = true;

      try {
        await updateProfileName();
        await getProfile();
        this.store.modals.fullname.isOpen = false;
      } catch (e) {
        console.error(e);
      } finally {
        this.store.modals.fullname.loading = false;
      }
    },
    async handleUpdateEmail() {
      this.store.modals.newEmail.loading = true;
      try {
        await updateUserEmail(store.modals.newEmail.data.email);
        this.store.modals.newEmail.isOpen = false;
      } catch (e) {
        console.error(e);
      } finally {
        this.store.modals.newEmail.loading = false;
      }
    },
    async handleUpdatePhone() {
      this.store.modals.phone.loading = true;
      try {
        await updateUserPhone(store.modals.phone.data.phone);
        this.store.modals.phone.isOpen = false;
      } catch (e) {
        console.error(e);
      } finally {
        this.store.modals.phone.loading = false;
      }
    },
    async handleLogout() {
      if (confirm('Sei sicuro di voler uscire?')) {
        await logout();
      }
    },
  },
};
</script>

<style scoped></style>
