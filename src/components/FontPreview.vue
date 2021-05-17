<template>
  <div class="font-preview" :style="fontStyle">
    {{previewText}}
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
        fontFamily: this.fontFamily,
        fontSize: '32px',
      };
    }
  }
};
</script>