<template>
  <div class="fontdrop relative">
    <div class="w-full h-24 bg-gray-300 p-5 rounded-2xl text-white flex items-center"
      @dragenter="dragenter"
      @dragover="dragover"
      @drop="drop">
      <div class="file-remover" v-if="this.file">
        <div>
          <span class="font-black text-lg">{{fileName}}</span>
        </div>
        <button @click="removeFile" class="text-red-700">Remove</button>
      </div>
      <div class="file-uploader" v-else>
        <input type="file" id="file-input" class="hidden"/>
        <label for="file-input" class="absolute inset-0 flex items-center justify-center text-center text-3xl font-black">Drop font file</label>
      </div>
    </div>
    <div v-if="this.isFontLoaded" :style="fontStyle">
      Hamburgefontsiv
    </div>
  </div>
</template>

<script>
import { sendMessagePromise, LOAD_FONT } from '@/utils/actions';

export default {
  data() {
    return {
      file: null,
      isFontLoaded: false
    };
  },

  computed: {
    fileName() {
      return this.file.name;
    },
    fontStyle() {
      return {
        fontFamily: 'testfont',
        fontSize: '32px',
      };
    },
  },

  methods: {
    removeFile() {
      this.file = null;
      this.isFontLoaded = false;
    },
    dragenter(e) {
      e.stopPropagation();
    },
    dragover(e) {
      e.preventDefault();
    },
    drop(e) {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const files = dt.files;

      this.handleFiles(files);
    },
    handleFiles(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        this.file = fileList[i];
        this.loadFontFace();
      }
    },
    loadFontFace() {
      const fontFileUrl = URL.createObjectURL(this.file);
      // TODO: Proper metadata
      const fontFace = new FontFace('testfont', `url(${fontFileUrl})`);
      fontFace.load().then(loadedFont => {
        document.fonts.add(loadedFont);
        this.isFontLoaded = true;
      }).catch(e => {
        console.error(e);
        this.isFontLoaded = false;
      });

      const fileReader = new FileReader();
      fileReader.onload = () => {
        sendMessagePromise({ action: LOAD_FONT, value: fileReader.result});
      };
      fileReader.readAsDataURL(this.file);
    }
  },
};
</script>