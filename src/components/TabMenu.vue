<template>
  <div class="border-b border-gray-700 my-3">
    <button v-for="tab in tabs" :key="tab.id" @click="$emit('tab-change', tab.id)"
      class="border-gray-700 py-1 px-3 focus:outline-none"
      :class="[
       currentTab === tab.id ? 'border-t border-r border-l' : ''
      ]">
      {{ tab.displayName }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    currentTab: {
      type: String,
      default: '',
    },
  },
}
</script>