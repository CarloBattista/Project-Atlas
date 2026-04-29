<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-black hover:bg-black/5 transition-colors cursor-pointer"
    @click="$refs.fileInput.click()"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <input type="file" ref="fileInput" class="hidden" :accept="accepts" @change="handleFileSelect" />

    <div v-if="!modelValue" class="space-y-2">
      <div class="flex justify-center">
        <span class="p-3 bg-black/5 rounded-full text-black">
          <Upload />
        </span>
      </div>
      <div class="text-sm text-gray-600">
        <span class="text-black font-semibold"
          >Clicca per caricare <span v-if="dragAndDrop" class="text-gray-600 font-normal">o trascina un file</span></span
        >
      </div>
      <p v-if="description" class="text-xs text-gray-400">{{ description }}</p>
    </div>

    <div v-else class="space-y-2">
      <div class="flex justify-center">
        <span class="p-3 bg-green-50 rounded-full text-green-600">
          <File />
        </span>
      </div>
      <div class="text-sm font-medium text-gray-900">{{ modelValue?.name }}</div>
      <div class="text-xs text-gray-500">{{ (modelValue?.size / 1024 / 1024).toFixed(2) }} MB</div>
      <div class="w-full flex items-center justify-center">
        <tlButton @click.stop="removeFile" size="small" variant="link" label="Rimuovi file" style="color: #df1b42" />
      </div>
    </div>
  </div>
  <div v-if="error" class="mt-2 text-sm text-[#df1b41] text-center">
    {{ error }}
  </div>
</template>

<script>
import tlButton from '../button/tl-button.vue';

// ICONS
import { Upload, File } from '@lucide/vue';

export default {
  name: 'tl-input-file',
  components: {
    tlButton,

    // ICONS
    Upload,
    File,
  },
  props: {
    modelValue: {
      type: [Object, File],
      default: null,
    },
    accepts: {
      type: String,
      default: '.pdf,.docx',
    },
    dragAndDrop: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: 'Solo PDF (max. 10MB)',
    },
  },
  data() {
    return {
      error: null,
      loading: false,
    };
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.processFile(file);
    },
    handleDrop(event) {
      if (!this.dragAndDrop) return;

      event.preventDefault();

      const file = event.dataTransfer.files[0];
      if (!file) return;

      this.processFile(file);
    },
    processFile(file) {
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      const allowedExtensions = this.accepts.split(',').map((ext) => ext.trim().toLowerCase());

      if (allowedExtensions.includes(fileExt)) {
        // Creiamo un oggetto che contenga sia il file che i suoi dettagli
        // per renderli facilmente accessibili nel componente padre
        const fileData = {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          extension: fileExt,
        };

        this.$emit('update:modelValue', fileData);
        this.error = null;
      } else {
        this.error = 'Per favore seleziona un file valido.';
        console.error(this.error);
      }
    },
    removeFile() {
      this.$emit('update:modelValue', null);
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
  },
};
</script>

<style scoped></style>
