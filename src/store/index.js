import Vue from 'vue'
import Vuex from 'vuex'
import extension from '@/store/modules/extension';

import {
  getDataUrl,
  getFontFamily,
  getVariationAxes,
  formatFontVariationSettings
} from '@/utils/font';
import opentype from 'opentype.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    extension,
  },
  state: {
    selectedFileName: null,
    fontFiles: {},
    fontData: {},
    selectedFontVariation: {},
  },
  getters: {
    selectedFontData: state => {
      const { fontData, selectedFileName } = state;
      if (!selectedFileName) {
        return;
      }
      return fontData[selectedFileName];
    },
    fontVariationSettings: state => {
      return formatFontVariationSettings(state.selectedFontVariation);
    },
  },
  mutations: {
    updateFontFile(state, file) {
      Vue.set(state.fontFiles, file.name, file);
      this.dispatch('loadFontData', file);
    },
    updateFontData(state, { fileName, data }) {
      Vue.set(state.fontData, fileName, data);
      this.dispatch('loadFontFace', fileName);
    },
    updateFontDataAttr(state, { fileName, fieldName, fieldValue }) {
      Vue.set(state.fontData[fileName], fieldName, fieldValue);
    },
    selectFont(state, fileName) {
      const { fontFiles } = state;
      if (fileName && fontFiles[fileName]) {
        state.selectedFileName = fileName;
      } else if (Object.keys(fontFiles)) {
        state.selectedFileName = Object.keys(fontFiles)[0];
      }
    },
    deselectFont(state) {
      Vue.delete(state.fontFiles, state.selectedFileName);
      Vue.delete(state.fontData, state.selectedFileName);
      state.selectedFileName = null;
      state.selectedFontVariation = {};
    },
    updateSelectedFontVariation(state, { tag , value }) {
      Vue.set(state.selectedFontVariation, tag, value);
    },
    updateHasLoadedSelectedFont(state, hasLoadedSelectedFont) {
      state.hasLoadedSelectedFont = hasLoadedSelectedFont;
    },
  },
  actions: {
    async loadFontData({ commit }, file) {
      const fontFileUrl = URL.createObjectURL(file);
      let opentypeData;
      try {
        opentypeData = await opentype.load(fontFileUrl);
      } catch(e) {
        console.error(e);
      }
      if (!opentypeData) {
        return;
      }

      // TODO: Handle locale for font family name
      commit('updateFontData', {
        fileName: file.name,
        data: {
          fontFamily: getFontFamily(opentypeData),
          url: fontFileUrl,
          variationAxes: getVariationAxes(opentypeData)
        }
      });
    },
    async loadFontFace({ state, commit }, fileName) {
      const fontData = state.fontData[fileName];
      const { fontFamily, url } = fontData;
      if (!fontFamily || !url) {
        return;
      }
      // Load font face in the popup for preview
      const fontFace = new FontFace(fontFamily, `url(${url})`);
      try {
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);
        commit('updateFontDataAttr', {
          fileName,
          fieldName: 'isLoaded',
          fieldValue: true
        });
      } catch(e) {
        console.error(e);
      }
    },
    async applySelectedFontToContent({ rootState, state, getters, dispatch }) {
      const { fontFiles, selectedFileName } = state;
      const { extension } = rootState;
      const { selectedFontData = {}, fontVariationSettings } = getters;
      const { fontFamily } = selectedFontData;

      if (!extension.hasLoadedFont) {
        const url = await getDataUrl(fontFiles[selectedFileName]);
        await dispatch('extension/initializeFontInContent', { fontFamily, url });
      }

      dispatch('extension/applyFontToContent', {
        fontFamily,
        fontVariationSettings
      });
    },
    updateFontVariation({ dispatch, getters, commit }, variation) {
      commit('updateSelectedFontVariation', variation);
      commit('extension/updateHasAppliedFontVariationSettings', false);
      const { fontVariationSettings } = getters;
      dispatch('extension/applyFontVariationSettingsToContent', fontVariationSettings);
    },
    removeSelectedFont({ commit }) {
      commit('deselectFont');
      commit('extension/updateHasAppliedFontFamily', false);
      commit('extension/updateHasLoadedFont', false);
    }
  },
})
