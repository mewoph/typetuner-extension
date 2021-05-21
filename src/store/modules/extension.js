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
    // TODO: Maybe this can be dynamic based on which tags
    // on the page have font declarations
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
    maxWidth: null,
    isInverted: false,
    isJustified: false,
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
    updateIsInverted(state, isInverted) {
      state.isInverted = isInverted;
    },
    updateIsJustified(state, isJustified) {
      state.isJustified = isJustified;
    },
    updateMaxWidthState(state, maxWidth) {
      state.maxWidth = maxWidth;
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

    async unapplyFontFromContent({ commit, dispatch }, tag) {
      if (!tag) {
        commit('deselectAllTags');
      }

      try {
        dispatch('resetPageSettings');

        const changeFontResponse = await sendMessageToActiveTab({
          action: RESET_FONT,
          value: { tag },
        });
        commit('addDebugMessage', changeFontResponse);
      } catch(e) {
        commit('addDebugMessage', e);
      }
    },

    async toggleSelectedElement({ state, commit, dispatch, rootGetters }, { tag, isSelected }) {
      if (isSelected) {
        commit('addActiveTag', tag);
        const { selectedFontData, fontVariationSettings } = rootGetters;
        const { fontFamily } = selectedFontData || {};
        if (fontFamily || fontVariationSettings) {
          dispatch('applyFontToContent', { fontFamily, fontVariationSettings });
        }

        // Apply page settings to newly selected elements
        const { isJustified, maxWidth } = state;
        if (isJustified) {
          dispatch('toggleJustification', true);
        }

        if (maxWidth) {
          dispatch('updateMaxWidth', maxWidth);
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
        commit('updateIsInverted', isInverted);
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
        commit('updateIsJustified', isJustified);
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
        commit('updateMaxWidthState', maxWidth);
      } catch (e) {
        commit('addDebugMessage', e);
      }
    },
    resetPageSettings({ dispatch }) {
      dispatch('toggleJustification', false);
      dispatch('toggleInvert', false);
      dispatch('updateMaxWidth', null);
    },
  }
};