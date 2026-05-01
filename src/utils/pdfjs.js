import * as pdfjsLib from 'pdfjs-dist';

// 👇 worker (obbligatorio)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export default pdfjsLib;
