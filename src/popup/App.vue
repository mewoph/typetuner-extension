<template>
  <div class="popup font-mono p-5">
    <FontDrop v-if="!selectedFontData"/>
    <FontControls v-else />

    <FontPreview v-if="canPreviewFont" :font-family="fontFamily" />
    <div class="fixed top-0 opacity-70" v-if="isDebugMode">Debug Message: {{ debugMessage }}</div>
  </div>
</template>

<script>
import FontDrop from '@/components/FontDrop';
import FontControls from '@/components/FontControls';
import FontPreview from '@/components/FontPreview';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    FontDrop,
    FontControls,
    FontPreview,
  },

  computed: {
    canPreviewFont() {
      const { selectedFontData = {} } = this;
      return selectedFontData.isLoaded;
    },
    fontFamily() {
      const { selectedFontData = {} } = this;
      return selectedFontData.fontFamily;
    },
    ...mapGetters(['selectedFontData']),
    ...mapState('extension', ['debugMessage', 'isDebugMode']),
  },
};
</script>

<style>
.popup {
  width: 400px;
  height: 400px;
}
</style>