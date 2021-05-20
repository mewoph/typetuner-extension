<template>
  <div class="font-variation-axis flex w-full mt-2 space-x-4">
      <div>{{ axisData.tag }}</div>
      <div class="flex w-full space-x-2">
        <div class="w-20">
          <input type="number"
            class="w-full shadow"
            :min="axisData.minValue"
            :max="axisData.maxValue"
            v-model="axisValue" />
        </div>
        <div class="w-12 text-right">{{ axisData.minValue }}</div>
        <input
          type="range"
          class="w-full"
          v-model="axisValue"
          :min="axisData.minValue"
          :max="axisData.maxValue" />
        <div class="w-12">{{ axisData.maxValue}}</div>
      </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
  computed: {
    axisValue: {
      get() {
        const { selectedFontVariation, axisData } = this;
        const { defaultValue, tag } = axisData;
        return selectedFontVariation[tag] || defaultValue;
      },
      set(newValue) {
        const { axisData } = this;
        this.updateFontVariation({ tag: axisData.tag, value: newValue });
      },
    },
    ...mapState(['selectedFontVariation']),
  },
  methods: {
    ...mapActions(['updateFontVariation']),
  },
}
</script>