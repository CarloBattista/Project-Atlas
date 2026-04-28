import { reactive } from 'vue';

export const auth = reactive({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,

  profile_not_completed: false,
});
