<template>
  <button class="rounded p-2 text-white cursor-pointer focus:outline-none focus:ring-2"
    :class="[
      elementData.isSelected ?
      'bg-indigo-700 hover:bg-indigo-800' :
      'bg-gray-400 hover:bg-indigo-800'
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