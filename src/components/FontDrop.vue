<template>
  <div class="font-drop relative">
    <div class="w-full h-24 bg-gray-300 p-5 rounded-2xl text-white flex items-center"
      @dragenter="dragenter"
      @dragover="dragover"
      @drop="drop">
      <div class="file-remover" v-if="this.fileName">
        <div>
          <span class="font-black text-lg">{{fileName}}</span>
        </div>
        <button @click="removeFile" class="text-red-700">Remove</button>
      </div>
      <div class="file-uploader" v-else>
        <input type="file" id="file-input" ref="fileInput" class="hidden" @change="onChange"/>
        <label for="file-input" class="absolute inset-0 flex items-center justify-center text-center text-3xl font-black">Drop font file</label>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessagePromise, LOAD_FONT } from '@/utils/actions';
// import opentype from 'opentype.js';
import { mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      file: null,
      isFontLoaded: false
    };
  },
  computed: {
    fileName() {
      return this.selectedFileName;
    },
    ...mapState(['selectedFileName']),
  },

  methods: {
    removeFile() {
      this.isFontLoaded = false;
      this.removeSelectedFont();
    },
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
      this.selectFont();
    },
    // sendFontDataToContent() {
    //   const fileReader = new FileReader();
    //   fileReader.onload = () => {
    //     sendMessagePromise({ action: LOAD_FONT, value: fileReader.result});
    //   };
    //   fileReader.readAsDataURL(this.file);
    // },
    // async loadFontFace() {
    //   console.log(this.$store);
    //   console.log(opentype);
    //   // this.sendFontDataToContent();

    //   const fontFileUrl = URL.createObjectURL(this.file);
    //   try {
    //     const font = await opentype.load(fontFileUrl);
    //     console.log('font', font);
    //   } catch(e) {
    //     console.error(e);
    //   }
      // TODO: Proper metadata
    //   const fontFace = new FontFace('testfont', `url(${fontFileUrl})`);
    //   try {
    //     const loadedFont = await fontFace.load();
    //     document.fonts.add(loadedFont);
    //     this.isFontLoaded = true;
    //   } catch(e) {
    //     console.error(e);
    //     this.isFontLoaded = false;
    //   }
    // }
    ...mapMutations(['updateFontFile', 'selectFont', 'removeSelectedFont']),
  },
};
</script>