import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY non configurata');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `Sei un sistema di parsing fatture esperto. Estrai i dati richiesti dal testo fornito.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'invoice_extraction',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                supplier_name: { type: ['string', 'null'] },
                supplier_number: { type: ['string', 'null'] },
                amount: { type: ['number', 'null'] },
                currency: { type: ['string', 'null'] },
                invoice_date: { type: ['string', 'null'] },
                due_date: { type: ['string', 'null'] },
              },
              required: ['supplier_name', 'supplier_number', 'amount', 'currency', 'invoice_date', 'due_date'],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    const result = await response.json();

    if (result.error) {
      console.error('Errore OpenAI:', result.error);
      throw new Error(`OpenAI Error: ${result.error.message}`);
    }

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('Risposta OpenAI non valida:', result);
      throw new Error('Risposta AI non valida: struttura mancante');
    }

    const content = JSON.parse(result.choices[0].message.content);

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
