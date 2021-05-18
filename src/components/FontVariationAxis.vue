<template>
  <div class="font-variation-axis flex w-full mt-2 space-x-4">
      <div>{{ axisData.tag }}</div>
      <div class="flex w-full space-x-2">
        <div class="w-12">({{ axisValue }})</div>
        <div class="w-12 text-right">{{ axisData.minValue }}</div>
        <input type="range"
        class="w-full"
        v-model="axisValue"
        :min="axisData.minValue"
        :max="axisData.maxValue"/>
        <div class="w-12">{{ axisData.maxValue}}</div>
      </div>
  </div>
</template>

<script>
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
}
</script>