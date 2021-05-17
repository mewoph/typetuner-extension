<template>
  <div class="popup font-mono p-5">
    <button @click="logConsole">Log in console</button>
    <button @click="changeBgColor">Change background</button>
    <button @click="changeFont">Apply font</button>
    <div>Last response: {{ response }}</div>
    <FontDrop />
    <FontPreview v-if="canPreviewFont" :font-family="fontFamily" />
  </div>
</template>

<script>

import {
  CONSOLE_PRINT,
  CHANGE_BG_COLOR,
  CHANGE_FONT,
  sendMessagePromise
} from '../utils/actions';

import FontDrop from '@/components/FontDrop';
import FontPreview from '@/components/FontPreview';

import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      fontToggled: true,
      response: '',
    };
  },

  components: {
    FontDrop,
    FontPreview,
  },

  computed: {
    canPreviewFont() {
      const { selectedFontData = {} } = this;
      return selectedFontData.isLoaded;
    },
    fontFamily() {
      const { selectedFontData = {} } = this;
      return selectedFontData.fontFamily;
    },
    ...mapGetters(['selectedFontData']),
  },

  methods: {
    logConsole() {
      browser.runtime.sendMessage({ content: 'response_needed' }).then(response => {
        sendMessagePromise({ action: CONSOLE_PRINT, value: response.value });
      });
      sendMessagePromise({ action: CONSOLE_PRINT });
    },
    changeBgColor() {
      const getRandomColorValue = () => {
        return Math.floor(Math.random() * 255);
      };
      sendMessagePromise({
        action: CHANGE_BG_COLOR,
        value: `rgb(${getRandomColorValue()}, ${getRandomColorValue()}, ${getRandomColorValue()})`,
      });
    },
    changeFont() {
      sendMessagePromise({
        action: CHANGE_FONT,
        value: this.fontToggled ? 'serif' : 'sans-serif',
        needsResponse: true,
      }).then((response) => {
        this.response = response.msg;
      });
      this.fontToggled = !this.fontToggled;
    }
  },
};
</script>

<style>
.popup {
  width: 400px;
  height: 400px;
}
</style>