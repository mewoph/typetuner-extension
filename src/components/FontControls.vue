<template>
  <div class="font-drop-area rounded-t-2xl h-24 bg-gray-300">
    <div class="file-remover w-full max-w-full">
      <div class="font-bold text-base truncate">
        {{selectedFileName}}
      </div>
      <div class="flex justify-between mt-2">
        <button @click="unapplyFont" v-if="hasAppliedFont"
          class="toggle-button">
          {{ localize('unapplyFontCta') }}
        </button>
        <button @click="applyFont" v-else
          class="toggle-button">
          {{ localize('applyFontCta') }}
        </button>
        <button @click="removeFile"
          class="text-purple-800 hover:text-purple-500 focus:outline-none">
          {{ localize('differentFontCta') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      // TODO: This should be pulled from the store.
      // Apply button should be re-activated if font variation changes.
      hasAppliedFont: false
    };
  },
  computed: {
    ...mapState(['selectedFileName']),
  },
  methods: {
    removeFile() {
      this.removeSelectedFont();
    },
    applyFont() {
      this.applySelectedFontToContent();
      this.hasAppliedFont = true;
    },
    unapplyFont() {
      this.hasAppliedFont = false;
      this.unapplyFontFromContent();
    },
    ...mapMutations(['removeSelectedFont']),
    ...mapActions(['applySelectedFontToContent']),
    ...mapActions('extension', ['unapplyFontFromContent']),
  }
};
</script>

<style>
.toggle-button {
  @apply p-2 bg-purple-700 text-white hover:bg-purple-500 focus:outline-none rounded-md;
}
</style>