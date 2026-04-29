import { supabase } from '../lib/supabase';

/**
 * Servizio per l'analisi delle fatture tramite Intelligenza Artificiale.
 * Utilizza Supabase Edge Functions per mantenere le chiavi API sicure.
 */
export const aiService = {
  /**
   * Analizza il testo di una fattura utilizzando un modello LLM (es. GPT-4)
   * @param {string} textContent - Il testo estratto dal PDF
   * @returns {Promise<Object>} I dati strutturati della fattura
   */
  async analyzeInvoiceWithAI(textContent) {
    try {
      // Opzione 1: Chiamata a una Supabase Edge Function (Consigliato per sicurezza)
      // La funzione 'analyze-invoice' dovrebbe gestire la chiamata a OpenAI/Anthropic
      const { data, error } = await supabase.functions.invoke('analyze-invoice', {
        body: { text: textContent },
      });

      if (error) throw error;
      return data;

      /* 
      // Opzione 2: Chiamata diretta (Solo per test rapidi, non sicuro in produzione)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Sei un assistente esperto in contabilità. Estrai i dati da questa fattura e restituiscili esclusivamente in formato JSON."
            },
            {
              role: "user",
              content: `Estrai i seguenti campi dal testo della fattura:
              - supplier_name (nome del fornitore)
              - supplier_number (numero fattura)
              - amount (totale come stringa numerica con punto decimale, es: "1250.50")
              - currency (codice valuta ISO es: EUR, USD)
              - invoice_date (formato YYYY-MM-DD)
              - due_date (formato YYYY-MM-DD)
              
              Testo fattura:
              ${textContent}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });
      
      const result = await response.json();
      return JSON.parse(result.choices[0].message.content);
      */
    } catch (err) {
      console.error('Errore durante l\'analisi AI:', err);
      throw new Error('L\'analisi AI ha fallito. Verifica la connessione o la configurazione del servizio.');
    }
  },
};
