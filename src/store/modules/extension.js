import {
  LOAD_FONT,
  CHANGE_FONT_FAMILY,
  CHANGE_FONT_VARIATION_SETTINGS,
  RESET_FONT,
  TOGGLE_INVERT,
  TOGGLE_JUSTIFICATION,
  UPDATE_MAX_WIDTH,
  sendMessageToActiveTab
} from '@/utils/actions';

import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    isDebugMode: process.env.NODE_ENV === 'development',
    debugMessages: [],
    originalFontConfig: null,
    hasLoadedFont: false,
    tagOptions: {
      body: true,
      p: false,
      h1: false,
      h2: false,
      h3: false,
      h4: false,
      h5: false,
      h6: false,
      article: false,
      section: false,
      ul: false,
      a: false,
      main: false,
    },
  },
  getters: {
    latestDebugMessage: state => {
      const { debugMessages } = state;
      return debugMessages[debugMessages.length - 1];
    },
    activeTagNames: state => {
      const { tagOptions } = state;
      return Object.entries(tagOptions).reduce((accumulator, [tagName, isSelected]) => {
        if (isSelected) {
          accumulator.push(tagName);
        }
        return accumulator;
      }, []);
    },
  },
  mutations: {
    updateOriginalFontConfig(state, config) {
      state.originalFontConfig = config;
    },
    addDebugMessage(state, { message }) {
      state.debugMessages.push(message);
    },
    updateHasLoadedFont(state, hasLoadedFont) {
      state.hasLoadedFont = hasLoadedFont;
    },
    addActiveTag(state, tagName) {
      Vue.set(state.tagOptions, tagName, true);
    },
    removeActiveTag(state, tagName) {
      Vue.set(state.tagOptions, tagName, false);
    },
    deselectAllTags(state) {
      const { tagOptions } = state;
      for (const key of Object.keys(tagOptions)) {
        tagOptions[key] = false;
      }
      state.tagOptions = tagOptions;
    },
  },
  actions: {
    async initializeFontInContent({ commit }, { fontFamily, url }) {
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

    async applyFontVariationSettingsToContent({ commit, getters }, fontVariationSettings) {
      try {
        const changeFontResponse = await sendMessageToActiveTab({
          action: CHANGE_FONT_VARIATION_SETTINGS,
          value: { fontVariationSettings, tags: getters.activeTagNames }
        });
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async applyFontFamilyToContent({ commit, getters }, fontFamily) {
      try {
        const changeFontResponse = await sendMessageToActiveTab({
          action: CHANGE_FONT_FAMILY,
          value: { fontFamily, tags: getters.activeTagNames }
        });
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async applyFontToContent({ dispatch }, { fontFamily, fontVariationSettings }) {
      dispatch('applyFontFamilyToContent', fontFamily);
      if (fontVariationSettings) {
        dispatch('applyFontVariationSettingsToContent', fontVariationSettings);
      }
    },

    async unapplyFontFromContent({ commit }, tag) {
      if (!tag) {
        commit('deselectAllTags');
      }

      try {
        const changeFontResponse = await sendMessageToActiveTab({
          action: RESET_FONT,
          value: { tag },
        });
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async toggleSelectedElement({ commit, dispatch, rootGetters }, { tag, isSelected }) {
      if (isSelected) {
        commit('addActiveTag', tag);
        const { selectedFontData, fontVariationSettings } = rootGetters;
        const { fontFamily } = selectedFontData || {};
        if (fontFamily || fontVariationSettings) {
          dispatch('applyFontToContent', { fontFamily, fontVariationSettings });
        }
      } else {
        dispatch('unapplyFontFromContent', tag);
        commit('removeActiveTag', tag);
      }
    },
    async toggleInvert({ commit }, isInverted) {
      try {
        const response = await sendMessageToActiveTab({
          action: TOGGLE_INVERT,
          value: { isInverted },
        });
        commit('addDebugMessage', response);
      } catch (e) {
        commit('addDebugMessage', e);
      }
    },
    async toggleJustification({ commit, getters }, isJustified) {
      try {
        const response = await sendMessageToActiveTab({
          action: TOGGLE_JUSTIFICATION,
          value: { isJustified, tags: getters.activeTagNames },
        });
        commit('addDebugMessage', response);
      } catch (e) {
        commit('addDebugMessage', e);
      }
    },
    async updateMaxWidth({ commit, getters }, maxWidth) {
      try {
        const response = await sendMessageToActiveTab({
          action: UPDATE_MAX_WIDTH,
          value: { maxWidth, tags: getters.activeTagNames },
        });
        commit('addDebugMessage', response);
      } catch (e) {
        commit('addDebugMessage', e);
      }
    }
  }
};