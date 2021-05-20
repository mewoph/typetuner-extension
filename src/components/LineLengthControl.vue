<template>
  <div class="w-full mt-2">
    <label for="max-width-input">{{ localize('maxLineLengthLabel') }}</label>
    <input
      id="max-width-input"
      type="range"
      class="w-full"
      v-model="maxWidthValue"
      :min="100"
      :max="1400" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    maxWidthValue: {
      get() {
        return this.maxWidth;
      },
      set(newValue) {
        this.updateMaxWidth(newValue);
      },
    },
    ...mapState('extension', ['maxWidth']),
  },
  methods: {
    ...mapActions('extension', ['updateMaxWidth']),
  },
}
</script>