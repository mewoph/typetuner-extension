<template>
  <div class="border-b border-purple-800 my-3">
    <button v-for="tab in tabs" :key="tab.id" @click="$emit('tab-change', tab.id)"
      class="py-1 px-3 focus:outline-none"
      :class="[
       currentTab === tab.id ? ' bg-purple-800 text-white' : 'text-purple-800'
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