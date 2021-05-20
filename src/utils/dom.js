const getTimestamp = () => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const applyToTags = (tags, fn) => {
  tags.forEach(tagName => {
    document.querySelectorAll(tagName).forEach(el => fn(el));
  });
};

const applyOriginalFont = (el) => {
  el.removeAttribute('style');
};

export const loadFont = async (fontFamily, url) => {
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

export const changeFontFamily = (fontFamily, tags) => {
  // TODO: Use CSS classes?
  applyToTags(tags, el => {
    if (!el.dataset.fontOverrides) {
      el.dataset.fontOverrides = true;
    }
    el.style.fontFamily = fontFamily;
  });
  return { message: `Set font-family: ${fontFamily} for ${tags} at ${getTimestamp()}`};
};

export const changeFontVariationSettings = (fontVariationSettings, tags) => {
  applyToTags(tags, el => {
    el.style.fontVariationSettings = fontVariationSettings;
  });
  return { message: `Set font-varation-settings: ${fontVariationSettings} at ${getTimestamp()}` };
};

export const restoreOriginalStyle = (tag) => {
  const selector = tag ? tag : '[data-font-overrides]';
  const nodes = document.querySelectorAll(selector);
  nodes.forEach(node => applyOriginalFont(node));
  return { message: `Restore original font for ${tag} at ${getTimestamp()}` };
};