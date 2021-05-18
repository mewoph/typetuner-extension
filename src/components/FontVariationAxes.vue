<template>
  <div class="font-variation-axes py-3">
    <FontVariationAxis v-for="axis in axes" :key="axis.tag" :axis-data="axis" />
  </div>
</template>

<script>
import FontVariationAxis from '@/components/FontVariationAxis';

export default {
  props: {
    axes: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    }
  },
  components: {
    FontVariationAxis,
  },
};
</script>