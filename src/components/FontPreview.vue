<template>
  <div class="font-preview p-5 rounded-b-2xl bg-gray-100 min-h-24">
    <div class="text-xs">
      {{ localize('previewLabel', fontFamily) }}
    </div>
    <div
      class="text-base focus:outline-none"
      contenteditable
      :style="fontStyle"
      ref="textPreview">
      {{previewText}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    fontFamily: {
      type: String,
      required: true
    }
  },
  computed: {
    previewText() {
      return this.localize('previewText');
    },
    fontStyle() {
      const { fontFamily, fontVariationSettings } = this;
      const style = {
        fontFamily: fontFamily
      };
      if (fontVariationSettings) {
        style.fontVariationSettings = fontVariationSettings;
      }
      return style;
    },
    ...mapGetters(['fontVariationSettings']),
  },
  mounted() {
    // Focus on contenteditable area
    this.$nextTick(() => {
      this.$refs.textPreview.focus();
    });
  },
};
</script>