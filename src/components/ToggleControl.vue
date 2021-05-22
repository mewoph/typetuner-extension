<template>
  <div class="flex items-center gap-x-2">
    <input type="checkbox" :id="id" v-model="toggleValue" />
    <label :for="id" class="ml-1">{{ labelText }}</label>
  </div>
</template>

<script>

export default {
  props: {
    labelText: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
      required: true,
    },
    modelName: {
      type: String,
      default: '',
    },
  },
  computed: {
    toggleValue: {
      get() {
        return this.$store.state.extension[this.modelName];
      },
      set(newValue) {
        this.$emit('toggle', newValue);
      },
    },
  },
};
</script>