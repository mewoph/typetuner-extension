<template>
  <div class="font-drop-area rounded-t-2xl h-24 bg-gray-300">
    <div class="file-remover w-full max-w-full">
      <div class="font-bold text-base truncate">
        {{selectedFileName}}
      </div>
      <div class="flex justify-between mt-2">
        <button @click="applySelectedFontToContent"
          class="p-2 bg-purple-700 text-white hover:bg-purple-500 focus:outline-none rounded-md">
          Apply font to page
        </button>
        <button @click="removeFile"
          class="text-pink-800 hover:text-pink-500 focus:outline-none">
          Use a different font
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['selectedFileName']),
  },
  methods: {
    removeFile() {
      this.removeSelectedFont();
    },
    ...mapMutations(['removeSelectedFont']),
    ...mapActions(['applySelectedFontToContent']),
  }
};
</script>