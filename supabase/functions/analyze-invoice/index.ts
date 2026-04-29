import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gestione CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    const modelUse = Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY non configurata');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Sei un assistente esperto in contabilità. Estrai i dati da questa fattura e restituiscili esclusivamente in formato JSON.',
          },
          {
            role: 'user',
            content: `Estrai i seguenti campi dal testo della fattura:
            - supplier_name (nome del fornitore)
            - supplier_number (numero fattura)
            - amount (totale come stringa numerica con punto decimale, es: \"1250.50\")
            - currency (codice valuta ISO es: EUR, USD)
            - invoice_date (formato YYYY-MM-DD)
            - due_date (formato YYYY-MM-DD)
            
            Testo fattura:
            ${text}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const result = await response.json();

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('Risposta OpenAI non valida:', result);
      throw new Error(`Risposta API non valida: ${result.error?.message || 'Struttura non attesa'}`);
    }

    const content = JSON.parse(result.choices[0].message.content);

    return new Response(JSON.stringify(content), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
