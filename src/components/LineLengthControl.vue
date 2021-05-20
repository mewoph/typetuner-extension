<template>
  <div class="w-full mt-2">
    <label for="max-width-input">{{ localize('maxLineLengthLabel') }}</label>
    <input
      id="max-width-input"
      type="range"
      class="w-full"
      v-model="maxWidth"
      :min="100"
      :max="1400"
      @input="onInput" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      maxWidth: null
    };
  },
  methods: {
    onInput() {
      this.updateMaxWidth(this.maxWidth);
    },
    ...mapActions('extension', ['updateMaxWidth']),
  },
}
</script>