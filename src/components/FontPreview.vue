<template>
  <div class="font-preview px-5 pb-5 rounded-b-2xl bg-gray-100 min-h-24">
    <div class="text-xs py-2 text-right">
      <button v-if="cta"
        class="text-purple-800 hover:text-pink-700 focus:outline-none border border-current px-1"
        @click="isShowingPreview = !isShowingPreview">
        {{cta}}
      </button>
    </div>

    <div
      class="text-base focus:outline-none"
      contenteditable
      :style="fontStyle"
      ref="textPreview" v-if="isShowingPreview">
      {{previewText}}
    </div>

    <div class="text-base" contenteditable="false" v-else>
      {{ fontVariationSettings }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isShowingPreview: true,
    };
  },
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
    cta() {
      const { isShowingPreview, localize, fontVariationSettings } = this;
      if (isShowingPreview) {
        return fontVariationSettings ? localize('inspectCta') : null;
      }
      return localize('previewCta');
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