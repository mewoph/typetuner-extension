<template>
  <div class="popup font-mono p-5 overflow-y-auto bg-gradient-to-b from-purple-100">
    <div class="fixed top-0 opacity-70 z-10" v-if="isDebugMode">
      DEBUG: {{ latestDebugMessage }}
    </div>

    <FontDrop v-if="!selectedFontData"/>
    <FontControls v-else />

    <FontPreview v-if="canPreviewFont" :font-family="fontFamily" />

    <div>
      <TabMenu @tab-change="onTabChange" :tabs="tabs" :current-tab="currentTab"/>
      <ContentElements />
    </div>

    <FontVariationAxes v-if="shouldShowFontControls" :axes="variationAxes" />
    <ContentControls v-if="shouldShowPageControls" />
  </div>
</template>

<script>
import FontDrop from '@/components/FontDrop';
import FontControls from '@/components/FontControls';
import FontPreview from '@/components/FontPreview';
import FontVariationAxes from '@/components/FontVariationAxes';
import ContentElements from '@/components/ContentElements';
import ContentControls from '@/components/ContentControls';
import TabMenu from '@/components/TabMenu';

import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      currentTab: 'page',
    };
  },
  components: {
    FontDrop,
    FontControls,
    FontPreview,
    FontVariationAxes,
    ContentElements,
    ContentControls,
    TabMenu,
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
    variationAxes() {
      const { selectedFontData } = this;
      if (selectedFontData) {
        return selectedFontData.variationAxes || [];
      }
      return [];
    },
    shouldShowFontControls() {
      return this.currentTab === 'font' && this.variationAxes.length;
    },
    shouldShowPageControls() {
      return this.currentTab === 'page';
    },
    tabs() {
      const { selectedFontData } = this;
      const fontTab = {
        displayName: this.localize('fontSettingsLabel'),
        id: 'font',
      };
      const pageTab = {
        displayName: this.localize('pageSettingsLabel'),
        id: 'page',
      };
      return selectedFontData ? [fontTab, pageTab] : [pageTab];
    },
    ...mapGetters(['selectedFontData']),
    ...mapGetters('extension', ['latestDebugMessage']),
    ...mapState('extension', ['isDebugMode']),
  },

  watch: {
    canPreviewFont(newVal) {
      if (newVal) {
        this.currentTab = 'font';
      } else {
        this.currentTab = 'page';
      }
    },
  },

  methods: {
    onTabChange(newTab) {
      this.currentTab = newTab;
    },
  },
};
</script>

<style>
.popup {
  width: 400px;
  height: 400px;
}
</style>