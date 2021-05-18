import {
  LOAD_FONT,
  CHANGE_FONT_FAMILY,
  CHANGE_FONT_VARIATION_SETTINGS,
  sendMessageToActiveTab
} from '@/utils/actions';

export default {
  namespaced: true,
  state: {
    isDebugMode: true,
    debugMessages: [],
    originalFontConfig: null,
    hasAppliedFontFamily: false,
    hasAppliedFontVariationSettings: true,
    hasLoadedFont: false,
  },
  getters: {
    hasFontChanges: state => {
      return !state.hasAppliedFontFamily || !state.hasAppliedFontVariationSettings;
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
    updateHasAppliedFontVariationSettings(state, hasAppliedFontVariationSettings) {
      state.hasAppliedFontVariationSettings = hasAppliedFontVariationSettings;
    },
    updateHasLoadedFont(state, hasLoadedFont) {
      state.hasLoadedFont = hasLoadedFont;
    },
  },
  actions: {
    async initializeFontInContent({ state, commit }, { fontFamily, url }) {
      const { originalFontConfig } = state;

      // TODO: Get this info from content page
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
        commit('updateHasAppliedFontVariationSettings', true);
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