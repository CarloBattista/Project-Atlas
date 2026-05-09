import { createRouter, createWebHistory } from 'vue-router';
import { authMiddleware } from './middleware/authMiddleware';

const APP_TITLE = 'Atlas';

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
    path: '/complete-profile',
    name: 'complete-profile',
    component: () => import('../views/Onboarding/Complete-profile.vue'),
    props: true,
    meta: { requiresAuth: true },
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

  // Invoice
  {
    path: '/invoice/:id',
    name: 'invoice',
    component: () => import('../views/Invoice/Invoice.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/new-invoice',
    name: 'new-invoice',
    component: () => import('../views/Invoice/New-invoice.vue'),
    props: true,
    meta: { requiresAuth: true },
  },

  // Clients
  {
    path: '/clients',
    name: 'clients',
    component: () => import('../views/Clients/Clients.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/new-client',
    name: 'new-client',
    component: () => import('../views/Clients/New-client.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/client/:id',
    name: 'client',
    component: () => import('../views/Clients/Client.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/client/edit/:id',
    name: 'edit-client',
    component: () => import('../views/Clients/New-client.vue'),
    props: true,
    meta: { requiresAuth: true },
  },

  // Settings
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings/Settings.vue'),
    props: true,
    meta: { requiresAuth: true },
  },

  // Error
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('../views/Not-found.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authMiddleware);

router.beforeEach((to, from, next) => {
  const pageTitle = to.meta.title;
  if (pageTitle) {
    document.title = pageTitle;
  } else {
    document.title = APP_TITLE;
  }
  next();
});

export default router;
