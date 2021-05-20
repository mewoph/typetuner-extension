import {
  CHANGE_FONT_FAMILY,
  CHANGE_FONT_VARIATION_SETTINGS,
  LOAD_FONT,
  RESET_FONT,
} from './utils/actions';

const getTimestamp = () => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const loadFont = async (fontFamily, url) => {
  const fontFace = new FontFace(fontFamily, `url(${url})`);
  let responseMsg;
  try {
    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);
    responseMsg = `Loaded ${fontFamily} at ${getTimestamp()}`;
  } catch(e) {
    console.error(e);
    responseMsg = e.message;
  }
  return { message: responseMsg };
};

const applyToTags = (tags, fn) => {
  tags.forEach(tagName => {
    document.querySelectorAll(tagName).forEach(el => fn(el));
  });
};

const changeFontFamily = (fontFamily, tags) => {
  // TODO: Use CSS classes?
  applyToTags(tags, el => {
    if (typeof el.dataset.originalFontFamily !== 'string') {
      el.dataset.originalFontFamily = el.style.fontFamily;
    }
    el.style.fontFamily = fontFamily;
  });
  return { message: `Set font-family: ${fontFamily} for ${tags} at ${getTimestamp()}`};
};

const changeFontVariationSettings = (fontVariationSettings, tags) => {
  applyToTags(tags, el => {
    if (typeof el.dataset.originalFontVariationSettings !== 'string') {
      el.dataset.originalFontVariationSettings = el.style.fontVariationSettings;
    }
    el.style.fontVariationSettings = fontVariationSettings;
  });
  return { message: `Set font-varation-settings: ${fontVariationSettings} at ${getTimestamp()}` };
};

const applyOriginalFont = (el) => {
  const { dataset } = el;
  const { originalFontFamily, originalFontVariationSettings } = dataset;
  if (typeof originalFontFamily === 'string') {
    el.style.fontFamily = originalFontFamily;
  }
  if (typeof originalFontVariationSettings === 'string') {
    el.style.fontVariationSettings = originalFontVariationSettings;
  }
};

const restoreOriginalStyle = (tag) => {
  const selector = tag ? tag : '[data-original-font-family], [data-original-font-variation-settings]';
  const nodes = document.querySelectorAll(selector);
  nodes.forEach(node => applyOriginalFont(node));
  return { message: `Restore original font for ${tag} at ${getTimestamp()}` };
};

browser.runtime.onMessage.addListener(async (request) => {
  const { message } = request;
  if (!message) {
    return;
  }
  const { action, value } = message;
  let response;

  if (action === CHANGE_FONT_FAMILY) {
    const { fontFamily, tags } = value;
    response = changeFontFamily(fontFamily, tags);
  
  } else if (action === CHANGE_FONT_VARIATION_SETTINGS) {
    const { fontVariationSettings, tags } = value;
    response = changeFontVariationSettings(fontVariationSettings, tags);

  } else if (action === LOAD_FONT) {
    const { fontFamily, url } = value;
    response = await loadFont(fontFamily, url);

  } else if (action === RESET_FONT) {
    const { tag } = value;
    return restoreOriginalStyle(tag);
  }

  return response;
});