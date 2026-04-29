import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configurazione del worker per pdfjs-dist utilizzando il file locale gestito da Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Estrae il testo grezzo da un file PDF
 * @param {File} file - Il file PDF da analizzare
 * @returns {Promise<string>} Il testo estratto
 */
export async function extractTextFromPDF(file) {
  try {
    // Gestione se viene passato un oggetto wrapper invece del file direttamente
    const actualFile = file.file || file;

    if (typeof actualFile.arrayBuffer !== 'function') {
      throw new Error('Il formato del file non è supportato o il file è corrotto.');
    }

    const arrayBuffer = await actualFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => (item.str ? item.str : '')).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Errore durante estrazione del testo dal PDF:', error);
    throw new Error('Impossibile leggere il file PDF. Assicurati che non sia protetto da password.');
  }
}

/**
 * Analizza il testo estratto per trovare campi tipici di una fattura
 * @param {string} text - Il testo della fattura
 * @returns {Object} Oggetto con i dati estratti
 */
export function analyzeInvoiceText(text) {
  const results = {
    supplier_name: 'Fornitore non identificato',
    supplier_number: '',
    amount: '0',
    currency: 'EUR',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
  };

  // 1. Estrazione Numero Fattura
  // Cerca pattern come "Fattura n.", "Doc. n.", "N. Fattura"
  const invoiceNumRegex = /(?:fattura|documento|doc\.)\s*(?:n\.|numero|num\.|#)?\s*([A-Z0-9/\-_]+)/i;
  const numMatch = text.match(invoiceNumRegex);
  if (numMatch && numMatch[1]) {
    results.supplier_number = numMatch[1].trim();
  }

  // 2. Estrazione Data
  // Cerca date nel formato DD/MM/YYYY o DD-MM-YYYY
  const dateRegex = /(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/;
  const dateMatches = text.match(new RegExp(dateRegex, 'g'));
  if (dateMatches && dateMatches.length > 0) {
    // Prendiamo la prima data trovata come data fattura
    const parts = dateMatches[0].match(dateRegex);
    if (parts) {
      const day = parts[1].padStart(2, '0');
      const month = parts[2].padStart(2, '0');
      let year = parts[3];
      if (year.length === 2) year = '20' + year;
      results.invoice_date = `${year}-${month}-${day}`;

      // Se c'è una seconda data, potrebbe essere la scadenza
      if (dateMatches.length > 1) {
        const dueParts = dateMatches[1].match(dateRegex);
        const dDay = dueParts[1].padStart(2, '0');
        const dMonth = dueParts[2].padStart(2, '0');
        let dYear = dueParts[3];
        if (dYear.length === 2) dYear = '20' + dYear;
        results.due_date = `${dYear}-${dMonth}-${dDay}`;
      } else {
        results.due_date = results.invoice_date;
      }
    }
  }

  // 3. Estrazione Importo Totale
  // Cerca parole chiave seguite da un numero decimale
  // Gestisce sia 1.234,56 che 1234,56 o 1234.56
  const amountRegex = /(?:totale|importo|tot\.|da pagare|balance|total)\s*(?:€|eur|usd|\$)?\s*([\d\s.',]+,\d{2}|[\d\s,',]+\.\d{2}|\d+[.,]\d{2})/i;
  const amountMatch = text.match(amountRegex);
  if (amountMatch && amountMatch[1]) {
    let cleanAmount = amountMatch[1].replace(/\s/g, '').replace(/'/g, '').replace(/\./g, '').replace(',', '.');

    // Se dopo la pulizia abbiamo più di un punto (es. era 1.234.56), teniamo solo l'ultimo
    if ((cleanAmount.match(/\./g) || []).length > 1) {
      const parts = cleanAmount.split('.');
      const decimals = parts.pop();
      cleanAmount = parts.join('') + '.' + decimals;
    }

    results.amount = cleanAmount;
  }

  // 4. Identificazione Valuta
  if (text.includes('$') || text.toUpperCase().includes('USD')) {
    results.currency = 'USD';
  } else if (text.includes('£') || text.toUpperCase().includes('GBP')) {
    results.currency = 'GBP';
  }

  // 5. Tentativo Identificazione Fornitore (Sperimentale)
  // Spesso il fornitore è all'inizio del testo o vicino a P.IVA
  const pivaRegex = /(?:p\.iva|partita iva|vat|id)\s*([a-z]{0,2}\s?\d{7,11})/i;
  const pivaMatch = text.match(pivaRegex);

  if (pivaMatch) {
    // Cerchiamo di prendere le parole prima della P.IVA o all'inizio
    const textLines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 3);
    if (textLines.length > 0) {
      // Spesso la prima riga è il nome dell'azienda
      results.supplier_name = textLines[0].substring(0, 50);
    }
  }

  return results;
}

/**
 * Funzione principale che coordina l'analisi completa
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function analyzeInvoice(file) {
  const text = await extractTextFromPDF(file);
  return analyzeInvoiceText(text);
}
