<template>
  <div class="popup font-mono p-5 overflow-y-auto bg-gradient-to-b from-purple-100">
    <div class="fixed top-0 opacity-70 z-10" v-if="isDebugMode">
      DEBUG: {{ latestDebugMessage }}
    </div>

    <FontDrop v-if="!selectedFontData"/>
    <FontControls v-else />

    <FontPreview v-if="canPreviewFont" :font-family="fontFamily" />
    <FontVariationAxes v-if="variationAxes.length" :axes="variationAxes" />
  </div>
</template>

<script>
import FontDrop from '@/components/FontDrop';
import FontControls from '@/components/FontControls';
import FontPreview from '@/components/FontPreview';
import FontVariationAxes from '@/components/FontVariationAxes';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    FontDrop,
    FontControls,
    FontPreview,
    FontVariationAxes,
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
    variationAxes() {
      const { selectedFontData } = this;
      if (selectedFontData) {
        return selectedFontData.variationAxes || [];
      }
      return [];
    },
    ...mapGetters(['selectedFontData']),
    ...mapGetters('extension', ['latestDebugMessage']),
    ...mapState('extension', ['isDebugMode']),
  },
};
</script>

<style>
.popup {
  width: 400px;
  height: 400px;
}
</style>