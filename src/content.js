import {
  CHANGE_FONT_FAMILY,
  CHANGE_FONT_VARIATION_SETTINGS,
  LOAD_FONT,
  RESET_FONT,
  TOGGLE_INVERT,
  TOGGLE_JUSTIFICATION,
  UPDATE_MAX_WIDTH,
} from './utils/actions';

import {
  changeFontFamily,
  changeFontVariationSettings,
  loadFont,
  restoreOriginalStyle,
  toggleInvert,
  toggleJustification,
  updateMaxWidth,
} from './utils/dom';

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

  } else if (action === TOGGLE_INVERT) {
    return toggleInvert(value.isInverted);

  } else if (action === TOGGLE_JUSTIFICATION) {
    const { isJustified, tags } = value;
    return toggleJustification(isJustified, tags);

  } else if (action === UPDATE_MAX_WIDTH) {
    const { maxWidth, tags } = value;
    return updateMaxWidth(maxWidth, tags);
  }

  return response;
});