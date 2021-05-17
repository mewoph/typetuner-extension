<template>
  <div class="w-full h-24 bg-gray-300 p-5 rounded-2xl text-white flex items-center">
    <div class="file-remover max-w-full">
      <div class="font-black text-lg truncate">
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