import Vue from 'vue'
import Vuex from 'vuex'
import extension from '@/store/modules/extension';

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
  },
  getters: {
    selectedFontData: state => {
      const { fontData, selectedFileName } = state;
      if (!selectedFileName) {
        return;
      }
      return fontData[selectedFileName];
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
    removeSelectedFont(state) {
      Vue.delete(state.fontFiles, state.selectedFileName);
      Vue.delete(state.fontData, state.selectedFileName);
      state.selectedFileName = null;
    }
  },
  actions: {
    async loadFontData({ commit }, file) {
      console.log('loading data for', file);
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

      // TODO: Pull in other fields from opentype.js
      // TODO: Handle locale
      commit('updateFontData', {
        fileName: file.name,
        data: {
          fontFamily: opentypeData.names.fontFamily.en,
          url: fontFileUrl,
        }
      });
    },
    async loadFontFace({ state, commit }, fileName) {
      const fontData = state.fontData[fileName];
      const { fontFamily, url } = fontData;
      if (!fontFamily || !url) {
        return;
      }
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
    applySelectedFontToContent({ state, getters, dispatch }) {
      const { fontFiles, selectedFileName } = state;
      const { selectedFontData = {} } = getters;
      const { fontFamily } = selectedFontData;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataUrl = fileReader.result;
        dispatch('extension/applyFontToContent', { url: dataUrl, fontFamily });
      };
      fileReader.readAsDataURL(fontFiles[selectedFileName]);
    }
  },
})
