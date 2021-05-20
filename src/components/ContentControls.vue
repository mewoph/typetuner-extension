<template>
  <div class="py-3">
    <LineLengthControl />
    <ToggleControl
      :label-text="localize('invertLabel')"
      :default-value="isInverted"
      @toggle="toggleInvert"
      id="invert-input" />
    <ToggleControl
      :label-text="localize('justifyLabel')"
      :default-value="isJustified"
      @toggle="toggleJustification"
      id="justification-input" />
  </div>
</template>

<script>
import LineLengthControl from '@/components/LineLengthControl';
import ToggleControl from '@/components/ToggleControl';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    LineLengthControl,
    ToggleControl,
  },
  computed: {
    ...mapState('extension', ['isInverted', 'isJustified']),
  },
  methods: {
    ...mapActions('extension', ['toggleInvert', 'toggleJustification']),
  }
};
</script>