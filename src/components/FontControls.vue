<template>
  <div class="font-drop-area rounded-t-2xl h-24 bg-gray-300">
    <div class="file-remover w-full max-w-full">
      <div class="font-bold text-base truncate">
        {{selectedFileName}}
      </div>
      <div class="flex justify-between mt-2 items-end">
        <button @click="unapplyFont"
          class="toggle-button bg-pink-700 hover:bg-purple-800">
          {{ localize('unapplyFontCta') }}
        </button>

        <button @click="removeFile"
          class="text-purple-800 hover:text-pink-700 focus:outline-none border border-current px-1">
          {{ localize('differentFontCta') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['selectedFileName']),
  },
  methods: {
    removeFile() {
      this.removeSelectedFont();
    },
    applyFont() {
      this.applySelectedFontToContent();
    },
    unapplyFont() {
      this.unapplyFontFromContent();
    },
    ...mapActions(['applySelectedFontToContent', 'removeSelectedFont']),
    ...mapActions('extension', ['unapplyFontFromContent']),
  }
};
</script>

<style>
.toggle-button {
  @apply p-2 text-white focus:outline-none rounded-md;
}
</style>