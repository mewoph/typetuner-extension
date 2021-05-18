<template>
  <div class="font-drop relative">
    <div class="font-drop-area h-48 text-white rounded-2xl"
      :class="[ hasHoverState ? 'bg-purple-600' : 'bg-gray-300' ]"
      @dragenter="dragenter"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop">
      <div class="file-uploader">
        <input type="file" id="file-input" ref="fileInput" class="hidden" @change="onChange"/>
        <label for="file-input" class="absolute inset-0 flex items-center justify-center text-center text-2xl font-black">
          {{ localize('dropAreaLabel') }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      hasHoverState: false,
    };
  },
  computed: {
    ...mapState(['selectedFileName']),
  },

  methods: {
    dragenter(e) {
      this.hasHoverState = true;
      e.stopPropagation();
      e.preventDefault();
    },
    dragover(e) {
      this.hasHoverState = true;
      e.stopPropagation();
      e.preventDefault();
    },
    dragleave() {
      this.hasHoverState = false;
    },
    drop(e) {
      this.hasHoverState = false;
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
      // TODO: File format validation
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