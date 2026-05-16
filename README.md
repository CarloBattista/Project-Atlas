# Atlas - Piattaforma di Gestione Fatture e Clienti (IN DEVELOPMENT)

Atlas è una moderna applicazione web progettata per semplificare la gestione finanziaria di professionisti e piccole imprese. La piattaforma offre strumenti avanzati per la creazione di fatture, la gestione dell'anagrafica clienti e l'analisi delle performance aziendali, il tutto potenziato dall'integrazione con l'intelligenza artificiale.

## 🚀 Caratteristiche Principali

- **Dashboard Intuitiva**: Visualizzazione immediata di statistiche, grafici finanziari (grazie a Chart.js) e ultime attività.
- **Gestione Clienti**: Database completo per monitorare contatti, indirizzi e storico fatturazione per ogni cliente.
- **Fatturazione Avanzata**: Creazione, modifica e gestione di fatture con supporto per diverse valute, tasse e sconti.
- **AI Invoice Parser**: Integrazione con Supabase Edge Functions per l'estrazione automatica dei dati dai file PDF delle fatture.
- **Visualizzatore PDF Integrato**: Anteprima immediata dei documenti direttamente nel browser.
- **Invio Email**: Sistema integrato per l'invio delle fatture ai clienti tramite Resend.
- **Timeline Attività**: Registro in tempo reale di tutte le azioni eseguite sulla piattaforma.
- **Autenticazione Sicura**: Gestione degli accessi e dei profili utente tramite Supabase Auth.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Grafici**: [Chart.js](https://www.chartjs.org/) & [Vue-Chartjs](https://vue-chartjs.org/)
- **Icone**: [Lucide Vue](https://lucide.dev/)

### Backend & Servizi

- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Edge Functions**: Supabase Functions (Deno)
- **Storage**: Supabase Storage per l'archiviazione dei PDF
- **Email**: [Resend](https://resend.com/)
- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/)
