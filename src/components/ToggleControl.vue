<template>
  <div class="flex items-center gap-x-2">
    <input type="checkbox" :id="id" v-model="toggleValue" @change="onChange"/>
    <label :for="id">{{ labelText }}</label>
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
    defaultValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      toggleValue: this.defaultValue,
    };
  },
  methods: {
    onChange() {
      this.$emit('toggle', this.toggleValue);
    },
  },
};
</script>