<template>
  <div class="font-variation-axis flex w-full mt-2 space-x-4">
      <div>{{ axisData.tag }}</div>
      <div class="flex w-full space-x-2">
        <div class="w-16">
          <input type="number"
            class="w-full shadow"
            :min="axisData.minValue"
            :max="axisData.maxValue"
            :value="axisValue" @change="onChange" />
        </div>
        <div class="w-12 text-right">{{ axisData.minValue }}</div>
        <input
          type="range"
          class="w-full"
          v-model="axisValue"
          :min="axisData.minValue"
          :max="axisData.maxValue"
          @input="onInput" />
        <div class="w-12">{{ axisData.maxValue}}</div>
      </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    axisData: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      axisValue: this.axisData.defaultValue
    };
  },
  methods: {
    onChange(e) {
      this.axisValue = e.target.value;
      this.onInput();
    },
    onInput() {
      const { axisData, axisValue: value } = this;
      this.updateFontVariation({ tag: axisData.tag, value });
    },
    ...mapActions(['updateFontVariation']),
  },
}
</script>