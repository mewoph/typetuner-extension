import { LOAD_FONT, CHANGE_FONT, sendMessagePromise } from '@/utils/actions';

export default {
  namespaced: true,
  state: {
    isDebugMode: true,
    debugMessage: '',
  },
  mutations: {
    updateDebugMessage(state, message) {
      state.debugMessage = message;
    },
  },
  actions: {
    async applyFontToContent({ commit }, { fontFamily, url }) {
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
    },
  }
};