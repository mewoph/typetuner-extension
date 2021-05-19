<template>
  <div class="content-elements flex mt-2 space-x-2">
    <ContentElementSelector
      v-for="el in elementOptions"
      :key="el.tag"
      :element-data="el"
      @click="onContentElementClicked(el)" />
  </div>
</template>

<script>
import ContentElementSelector from '@/components/ContentElementSelector';
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    ContentElementSelector,
  },
  computed: {
    elementOptions() {
      const { tagOptions } = this;
      return Object.entries(tagOptions).reduce((accumulator, [tag, isSelected]) => {
        accumulator.push({ tag, isSelected })
        return accumulator;
      }, []);
    },
    ...mapState('extension', ['tagOptions']),
  },
  methods: {
    onContentElementClicked(element) {
      const { tag, isSelected } = element;
      const newState = !isSelected;
      Vue.set(element, 'isSelected', newState);
      // toggle element state
      this.toggleSelectedElement({ tag, isSelected: newState });
    },
    ...mapActions('extension', ['toggleSelectedElement']),
  },
};
</script>