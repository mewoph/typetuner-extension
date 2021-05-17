<template>
  <button class="button" :class="[
    isDisabled ? 'cursor-not-allowed opacity-20' : 'hover:bg-gray-700'
  ]">
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style>
.button {
  @apply bg-gray-500 text-white font-bold rounded px-2 py-2 mt-4;
}
</style>