<template>
  <button class="rounded p-2 text-white cursor-pointer"
    :class="[
      elementData.isSelected ?
      'bg-indigo-700 hover:bg-gray-400' :
      'bg-gray-400 hover:bg-indigo-700'
    ]"
    @click="$emit('click')"
  >
    {{ elementData.tag }}
  </button>
</template>

<script>
export default {
  props: {
    elementData: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },

};
</script>