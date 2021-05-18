import {
  LOAD_FONT,
  CHANGE_FONT_FAMILY,
  CHANGE_FONT_VARIATION_SETTINGS,
  sendMessageToActiveTab
} from '@/utils/actions';

export default {
  namespaced: true,
  state: {
    isDebugMode: process.env.NODE_ENV === 'development',
    debugMessages: [],
    originalFontConfig: null,
    hasAppliedFontFamily: false,
    hasLoadedFont: false,
  },
  getters: {
    hasFontChanges: state => {
      return !state.hasAppliedFontFamily;
    },
    latestDebugMessage: state => {
      const { debugMessages } = state;
      return debugMessages[debugMessages.length - 1];
    },
  },
  mutations: {
    updateOriginalFontConfig(state, config) {
      state.originalFontConfig = config;
    },
    addDebugMessage(state, { message }) {
      state.debugMessages.push(message);
    },
    updateHasAppliedFontFamily(state, hasAppliedFontFamily) {
      state.hasAppliedFontFamily = hasAppliedFontFamily;
    },
    updateHasLoadedFont(state, hasLoadedFont) {
      state.hasLoadedFont = hasLoadedFont;
    },
  },
  actions: {
    async initializeFontInContent({ state, commit }, { fontFamily, url }) {
      const { originalFontConfig } = state;

      // TODO: Get this info from content page, also account for other font settings
      if (!originalFontConfig) {
        commit('updateOriginalFontConfig', { fontFamily: 'sans-serif' });
      }

      try {
        const loadFontResponse = await sendMessageToActiveTab({
          action: LOAD_FONT,
          value: { fontFamily, url }
        });
        commit('updateHasLoadedFont', true);
        commit('addDebugMessage', loadFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async applyFontVariationSettingsToContent({ commit }, fontVariationSettings) {
      try {
        const changeFontResponse = await sendMessageToActiveTab({
          action: CHANGE_FONT_VARIATION_SETTINGS,
          value: { fontVariationSettings }
        });
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async applyFontFamilyToContent({ commit }, fontFamily) {
      try {
        const changeFontResponse = await sendMessageToActiveTab({
          action: CHANGE_FONT_FAMILY,
          value: { fontFamily }
        });
        commit('updateHasAppliedFontFamily', true);
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async applyFontToContent({ state, dispatch }, { fontFamily, fontVariationSettings }) {
      const { hasAppliedFontFamily } = state;
      if (!hasAppliedFontFamily) {
        dispatch('applyFontFamilyToContent', fontFamily);
      }
      if (fontVariationSettings) {
        dispatch('applyFontVariationSettingsToContent', fontVariationSettings);
      }
    },

    async unapplyFontFromContent({ state, commit }) {
      try {
        const changeFontResponse = await sendMessageToActiveTab({
          action: CHANGE_FONT_FAMILY,
          value: state.originalFontConfig,
          needsResponse: true
        });
        commit('updateHasAppliedFontFamily', false);
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },
  }
};