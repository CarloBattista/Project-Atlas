<template>
  <div class="pdf-viewer relative w-full h-full flex flex-col bg-[#F5F5F5] rounded-[18px] overflow-hidden border border-black/5">
    <!-- PDF Toolbar -->
    <div class="pdf-toolbar w-full h-12 px-4 flex items-center justify-between bg-white border-b border-black/5 z-10">
      <div class="flex items-center gap-2">
        <tlIconButton size="extra-small" icon="ChevronLeft" @click="prevPage" :disabled="pageNum <= 1" />
        <span class="text-sm font-medium text-black">Pagina {{ pageNum }} di {{ pageCount }}</span>
        <tlIconButton size="extra-small" icon="ChevronRight" @click="nextPage" :disabled="pageNum >= pageCount" />
      </div>

      <div class="flex items-center gap-2">
        <tlIconButton size="extra-small" icon="Minus" @click="zoomOut" :disabled="scale <= 0.5" />
        <span class="text-sm font-medium text-black w-12 text-center">{{ Math.round(scale * 100) }}%</span>
        <tlIconButton size="extra-small" icon="Plus" @click="zoomIn" :disabled="scale >= 3" />
        <tlButton v-if="scale !== 1.0" @click="scale = 1.0" size="small" variant="link" label="Reset" />
      </div>

      <div class="flex items-center">
        <tlIconButton size="extra-small" icon="Download" @click="downloadPdf" />
      </div>
    </div>
    <!-- PDF Canvas Container -->
    <div ref="container" class="pdf-container flex-1 overflow-auto p-8 bg-[#F5F5F5]">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
        <loader />
      </div>
      <div class="pdf-wrapper relative mx-auto transition-all duration-200 ease-in-out" :style="{ width: scale * 100 + '%' }">
        <canvas ref="pdfCanvas" class="shadow-2xl bg-white w-full h-auto block rounded-sm"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import pdfjsLib from '../../utils/pdfjs';

import loader from './loader.vue';
import tlIconButton from '../button/tl-icon-button.vue';
import tlButton from '../button/tl-button.vue';

export default {
  name: 'pdf-viewer',
  components: {
    loader,
    tlIconButton,
    tlButton,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pageNum: 1,
      pageCount: 0,
      scale: 1.0,
      loading: false,
    };
  },
  created() {
    // Storing non-reactive references to avoid Proxy issues with pdf.js private members
    this.pdfDoc = null;
    this.renderTask = null;
  },
  methods: {
    async loadPdf(url) {
      this.loading = true;
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        this.pdfDoc = await loadingTask.promise;
        this.pageCount = this.pdfDoc.numPages;
        this.pageNum = 1;
        await this.renderPage(this.pageNum);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        this.loading = false;
      }
    },
    async renderPage(num) {
      if (!this.pdfDoc) return;

      if (this.renderTask) {
        this.renderTask.cancel();
      }

      try {
        const page = await this.pdfDoc.getPage(num);
        const canvas = this.$refs.pdfCanvas;
        const context = canvas.getContext('2d');

        // Render at a high fixed scale for quality
        const renderScale = 2.0;
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: renderScale });

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderContext = {
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        };

        this.renderTask = page.render(renderContext);
        await this.renderTask.promise;
        this.renderTask = null;
      } catch (error) {
        if (error.name === 'RenderingCancelledException') return;
        console.error('Error rendering page:', error);
      }
    },
    prevPage() {
      if (this.pageNum <= 1) return;
      this.pageNum--;
      this.renderPage(this.pageNum);
    },
    nextPage() {
      if (this.pageNum >= this.pageCount) return;
      this.pageNum++;
      this.renderPage(this.pageNum);
    },
    zoomIn() {
      this.scale += 0.1;
    },
    zoomOut() {
      if (this.scale <= 0.2) return;
      this.scale -= 0.1;
    },
    downloadPdf() {
      const link = document.createElement('a');
      link.href = this.url;
      link.download = 'fattura.pdf';
      link.target = '_blank';
      link.click();
    },
  },
  watch: {
    url: {
      handler(newUrl) {
        if (newUrl) {
          this.loadPdf(newUrl);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.pdf-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.pdf-container::-webkit-scrollbar {
  width: 6px;
}

.pdf-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.pdf-wrapper {
  display: inline-block;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
