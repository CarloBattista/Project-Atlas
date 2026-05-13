/**
 * Genera il contenuto HTML per l'email della fattura.
 * @param {Object} invoice - I dati della fattura.
 * @param {Object} client - I dati del cliente.
 * @returns {string} - Il contenuto HTML.
 */
export function generateInvoiceEmailHtml(invoice, client) {
  const amountFormatted = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(invoice.amount);

  return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #000;">Nuova Fattura da ${invoice.supplier_name}</h2>
      <p>Gentile <strong>${client.name}</strong>,</p>
      <p>Ti informiamo che è stata emessa una nuova fattura a tuo carico.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #666;">Numero Fattura:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right;">${invoice.supplier_number || 'N/D'}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Data:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date(invoice.invoice_date).toLocaleDateString('it-IT')}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Scadenza:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date(invoice.due_date).toLocaleDateString('it-IT')}</td>
          </tr>
          <tr style="border-top: 1px solid #ddd;">
            <td style="padding: 10px 0; color: #000; font-weight: bold;">Totale da pagare:</td>
            <td style="padding: 10px 0; color: #000; font-weight: bold; text-align: right; font-size: 18px;">${amountFormatted}</td>
          </tr>
        </table>
      </div>
      
      <p>Puoi visualizzare e scaricare la fattura completa cliccando sul pulsante qui sotto:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${invoice.file_url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Visualizza Fattura</a>
      </div>
      
      <p style="font-size: 12px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        Se hai domande riguardo a questa fattura, non esitare a contattarci.<br>
        Grazie per la collaborazione.
      </p>
    </div>
  `;
}
