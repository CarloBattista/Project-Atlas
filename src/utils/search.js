/**
 * Utility per la gestione della ricerca (lato client e debounce)
 */

/**
 * Crea una funzione debounced
 * @param {Function} func - La funzione da eseguire
 * @param {number} wait - Il tempo di attesa in ms
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Nota: La logica di filtraggio è stata spostata lato server in src/api/search.js
 * per migliorare le performance con grandi set di dati e sfruttare le capacità
 * di indicizzazione del database Supabase.
 */
