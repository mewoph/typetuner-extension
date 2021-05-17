<template>
  <div class="popup font-mono p-5">
    <FontDrop v-if="!selectedFontData"/>
    <FontRemove v-else />

    <FontPreview v-if="canPreviewFont" :font-family="fontFamily" />
    <Button
      button-text="Apply font"
      :is-disabled="!selectedFontData"
      @click.native="applySelectedFontToContent"
      />
    <div v-if="isDebugMode">Debug Message: {{ debugMessage }}</div>
  </div>
</template>

<script>
import FontDrop from '@/components/FontDrop';
import FontRemove from '@/components/FontRemove';
import FontPreview from '@/components/FontPreview';
import Button from '@/components/Button';

import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    FontDrop,
    FontRemove,
    FontPreview,
    Button,
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

  methods: {
    ...mapActions(['applySelectedFontToContent']),
  },
};
</script>

<style>
.popup {
  width: 400px;
  height: 400px;
}
</style>