<template>
  <div class="font-drop relative">
    <div class="w-full h-24 bg-gray-300 p-5 rounded-2xl text-white flex items-center"
      @dragenter="dragenter"
      @dragover="dragover"
      @drop="drop">
      <div class="file-uploader">
        <input type="file" id="file-input" ref="fileInput" class="hidden" @change="onChange"/>
        <label for="file-input" class="absolute inset-0 flex items-center justify-center text-center text-3xl font-black">Drop font file</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['selectedFileName']),
  },

  methods: {
    dragenter(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    dragover(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    drop(e) {
      e.stopPropagation();
      e.preventDefault();

      const { dataTransfer } = e;
      const { files } = dataTransfer;

      this.handleFiles(files);
    },
    onChange() {
      this.handleFiles(this.$refs.fileInput.files);
    },
    handleFiles(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        this.updateFontFile(fileList[i]);
      }
      // Currently only one font is supported.
      // TODO: Update this logic when UI supports multiple fonts
      this.selectFont();
    },
    ...mapMutations(['updateFontFile', 'selectFont', 'removeSelectedFont']),
  },
};
</script>