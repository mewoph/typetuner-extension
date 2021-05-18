import {
  CHANGE_FONT_FAMILY,
  CHANGE_FONT_VARIATION_SETTINGS,
  LOAD_FONT,
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

const changeFontFamily = (fontFamily) => {
  // TODO: Use CSS classes?
  // TODO: Support setting font on elements other than body
  document.body.style.fontFamily = fontFamily;
  return { message: `Set font-family: ${fontFamily} at ${getTimestamp()}`};
};

const changeFontVariationSettings = (fontVariationSettings) => {
  document.body.style.fontVariationSettings = fontVariationSettings;
  return { message: `Set font-varation-settings: ${fontVariationSettings} at ${getTimestamp()}` };
};

browser.runtime.onMessage.addListener(async (request) => {
  const { message } = request;
  if (!message) {
    return;
  }
  const { action, value } = message;
  let response;

  if (action === CHANGE_FONT_FAMILY) {
    const { fontFamily } = value;
    response = changeFontFamily(fontFamily);
  
  } else if (action === CHANGE_FONT_VARIATION_SETTINGS) {
    const { fontVariationSettings } = value;
    response = changeFontVariationSettings(fontVariationSettings);

  } else if (action === LOAD_FONT) {
    const { fontFamily, url } = value;
    response = await loadFont(fontFamily, url);
  }

  return response;
});