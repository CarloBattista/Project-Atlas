import { reactive } from 'vue';

export const toastState = reactive({
  toasts: [],
});

/**
 * Aggiunge un toast alla lista.
 * @param {Object} options - Opzioni del toast.
 * @param {string} options.message - Messaggio da visualizzare.
 * @param {string} [options.type='info'] - Tipo di toast ('info', 'success', 'error', 'warning', 'dark').
 * @param {number} [options.duration=3000] - Durata in millisecondi.
 * @param {boolean} [options.showIcon=true] - Se mostrare l'icona del tipo.
 * @param {boolean} [options.closable=true] - Se mostrare il pulsante di chiusura.
 */
export const addToast = (options) => {
  const id = Date.now() + Math.random();
  const toast = {
    id,
    message: options.message || '',
    type: options.type || 'info',
    duration: options.duration !== undefined ? options.duration : 3000,
    showIcon: options.showIcon !== undefined ? options.showIcon : true,
    closable: options.closable !== undefined ? options.closable : true,
  };

  toastState.toasts.push(toast);

  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }

  return id;
};

/**
 * Rimuove un toast tramite ID.
 * @param {number} id - ID del toast.
 */
export const removeToast = (id) => {
  const index = toastState.toasts.findIndex((t) => t.id === id);
  if (index !== -1) {
    toastState.toasts.splice(index, 1);
  }
};

export const toast = {
  info: (message, options = {}) => addToast({ ...options, message, type: 'info' }),
  success: (message, options = {}) => addToast({ ...options, message, type: 'success' }),
  error: (message, options = {}) => addToast({ ...options, message, type: 'error' }),
  warning: (message, options = {}) => addToast({ ...options, message, type: 'warning' }),
  dark: (message, options = {}) => addToast({ ...options, message, type: 'dark' }),
};
