<template>
  <div class="py-3">
    <LineLengthControl />
    <ToggleControl :label-text="localize('invertLabel')" @toggle="toggleInvert" id="invert-input" />
    <ToggleControl :label-text="localize('justifyLabel')" @toggle="toggleJustification" id="justification-input" />
  </div>
</template>

<script>
import LineLengthControl from '@/components/LineLengthControl';
import ToggleControl from '@/components/ToggleControl';
import { mapActions } from 'vuex';

export default {
  components: {
    LineLengthControl,
    ToggleControl,
  },
  methods: {
    ...mapActions('extension', ['toggleInvert', 'toggleJustification']),
  }
};
</script>