<template>
  <div class="font-drop-area rounded-t-2xl h-20 bg-gray-300">
    <div class="file-remover max-w-full">
      <div class="font-bold text-base truncate">
        {{selectedFileName}}
      </div>
      <button @click="removeFile" class="text-red-700">Remove</button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['selectedFileName']),
  },
  methods: {
    removeFile() {
      this.removeSelectedFont();
    },
    ...mapMutations(['removeSelectedFont'])
  }
};
</script>