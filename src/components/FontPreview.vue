<template>
  <div class="font-preview p-5 rounded-b-2xl bg-gray-100 h-28">
    <div class="text-xs">Preview</div>
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
export default {
  props: {
    fontFamily: {
      type: String,
      required: true
    }
  },
  computed: {
    previewText() {
      return chrome.i18n.getMessage('previewText');
    },
    fontStyle() {
      return {
        fontFamily: this.fontFamily
      };
    }
  },
  mounted() {
    // Focus on contenteditable area
    this.$nextTick(() => {
      this.$refs.textPreview.focus();
    });
  },
};
</script>