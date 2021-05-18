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
    loadedFonts: [],
  },
  getters: {
    hasFontChanges: state => {
      return !state.hasAppliedFontFamily || !state.hasAppliedFontVariationSettings;
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
    updateLoadedFonts(state, loadedFont) {
      state.loadedFonts.push(loadedFont);
    },
  },
  actions: {
    async loadFontInContentIfNeeded({ state, commit }, { fontFamily, url }) {
      const { originalFontConfig, loadedFonts } = state;
      if (loadedFonts.includes(fontFamily)) {
        return;
      }
      // TODO: Get this info from content page
      if (!originalFontConfig) {
        commit('updateOriginalFontConfig', { fontFamily: 'sans-serif' });
      }
      const loadFontResponse = await sendMessageToActiveTab({
        action: LOAD_FONT,
        value: { fontFamily, url }
      });
      commit('updateLoadedFonts', fontFamily);
      commit('addDebugMessage', loadFontResponse);
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

    async applyFontToContent({ state, dispatch }, { fontFamily, url, fontVariationSettings }) {
      await dispatch('loadFontInContentIfNeeded', { fontFamily, url });
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