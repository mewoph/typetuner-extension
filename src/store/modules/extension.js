import { LOAD_FONT, CHANGE_FONT, sendMessagePromise } from '@/utils/actions';

export default {
  namespaced: true,
  state: {
    isDebugMode: true,
    debugMessage: '',
    originalFontConfig: null,
  },
  mutations: {
    updateOriginalFontConfig(state, config) {
      state.originalFontConfig = config;
    },
    updateDebugMessage(state, message) {
      state.debugMessage = message;
    },
  },
  actions: {
    async applyFontToContent({ state, commit }, { fontFamily, url }) {
      // TODO: Get this from content page
      if (!state.originalFontConfig) {
        commit('updateOriginalFontConfig', { fontFamily: 'sans-serif' });
      }

      try {
        await sendMessagePromise({
          action: LOAD_FONT,
          value: { fontFamily, url }
        });
        const changeFontResponse = await sendMessagePromise({
          action: CHANGE_FONT,
          value: { fontFamily },
          needsResponse: true
        });
        commit('updateDebugMessage', changeFontResponse.msg);
      } catch(e) {
        commit('updateDebugMessage', e);
      }
    },
    async unapplyFontFromContent({ state, commit }) {
      try {
        const changeFontResponse = await sendMessagePromise({
          action: CHANGE_FONT,
          value: state.originalFontConfig,
          needsResponse: true
        });
        commit('updateDebugMessage', changeFontResponse.msg);
      } catch(e) {
        commit('updateDebugMessage', e);
      }
    },
  }
};