<template>
  <div class="font-preview p-5 rounded-b-2xl bg-gray-100 h-24">
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