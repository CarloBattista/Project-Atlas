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
    path: '/upload-invoice',
    name: 'upload-invoice',
    component: () => import('../views/Invoice/Upload-invoice.vue'),
    props: true,
    meta: { requiresAuth: true },
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
