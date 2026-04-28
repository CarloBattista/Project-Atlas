<template>
  <div class="fixed z-9999 top-0 left-0 w-fit h-6 m-4">
    <RouterLink to="/">
      <appLogo class="h-full" />
    </RouterLink>
  </div>
  <main class="w-full md:pt-[10%] pt-[15%] px-4 sm:max-w-[400px] mx-auto">
    <div class="w-full h-full flex flex-col gap-8">
      <div class="w-full flex flex-col gap-1 text-center">
        <h1 class="text-black text-2xl font-semibold">Devi prima confermare la tua email</h1>
        <p class="text-gray-500 text-base font-normal">Per continuare, conferma la tua email.</p>
      </div>
      <a href="https://mail.google.com/mail" target="_blank">
        <tlButton type="submit" variant="secondary" label="Apri email" class="w-full mt-6" />
      </a>
    </div>
  </main>
</template>

<script>
import appLogo from '../../components/global/app-logo.vue';
import tlButton from '../../components/button/tl-button.vue';

export default {
  name: 'Confirm-email',
  components: {
    appLogo,
    tlButton,
  },
};
</script>

<style scoped></style>
