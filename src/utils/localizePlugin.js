const localize = (key, params) => {
  if (!key) {
    return '';
  }
  if (typeof chrome === 'undefined') {
    return key;
  }
  return chrome.i18n.getMessage(key, params);
};

export default {
  install(Vue) {
    Vue.prototype.localize = localize;
  }
};
