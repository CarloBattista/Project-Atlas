import { createRouter, createWebHistory } from 'vue-router';

const APP_TITLE = 'Project Atlas';

const routes = [
  // Auth
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Onboarding/Signup.vue'),
    props: true,
    meta: { requiresGuest: true },
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Onboarding/Signin.vue'),
    props: true,
    meta: { requiresGuest: true },
  },
  {
    path: '/confirm-email',
    name: 'confirm-email',
    component: () => import('../views/Onboarding/Confirm-email.vue'),
    props: true,
  },

  // General
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const authParsed = JSON.parse(isAuthenticated);

  const pageTitle = to.meta.title;
  document.title = pageTitle ? pageTitle : APP_TITLE;

  // Logica Middleware/Guard
  if (to.meta.requiresAuth && !authParsed) {
    // Se la rotta richiede auth e l'utente non è autenticato -> redirect a signin
    next({ name: 'signin' });
  } else if (to.meta.requiresGuest && authParsed) {
    // Se la rotta è per guest e l'utente è autenticato -> redirect a home
    next({ name: 'home' });
  } else {
    // Altrimenti procedi normalmente
    next();
  }
});

export default router;
